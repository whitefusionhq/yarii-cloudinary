import { Controller } from "stimulus"
import axios from "axios"

export default class extends Controller {
  static targets = ["rows", "thumbnail", "input"]

  connect() {
    this.ids = []
    this.currentIndex = -1
    if (this.data.get('ids')) {
      this.ids = this.data.get('ids').split(',')
    }
    this.updateIndex()

    const uploadPreset = this.data.get('uploadPreset') || 'yarii_editor'

    this.cloudinaryWidget = cloudinary.createUploadWidget({
      cloudName: this.data.get('cloud'),
      multiple: true,
      sources: [
        'local',
        'url'
      ],
      uploadPreset: uploadPreset}, (error, result) => { 
        if (!error && result && result.event === "success") {
          this.widgetSuccessCallback(result.info)
        }
      }
    )
  }

  updateIndex() {
    this.latestIndex = this.ids.length - 1
  }

  async widgetSuccessCallback(result) {
    const publicId = result.public_id
    if (this.currentIndex == -1) {
      // When adding new images
      this.ids.push(publicId)
      this.updateIndex()
      const formItemPath = this.data.get('formItemPath').replace('/0/', `/${encodeURIComponent(publicId)}/`)
      try {
        const response = await axios.get(formItemPath, {params: {
          name: `${this.data.get('name')}[]`,
          index: this.latestIndex,
          input_classes: this.data.get('inputClasses'),
          placeholder: this.data.get('placeholder')
        }})
        const newRow = document.createElement('template')
        newRow.innerHTML = response.data
        this.rowsTarget.append(newRow.content.cloneNode(true))
      } catch (error) {
        console.log(error)
      }
    }
    else {
      const formItemPath = this.data.get('formItemPath').replace('/0/', `/${encodeURIComponent(publicId)}/`)
      try {
        const response = await axios.get(formItemPath, {params: {
          name: `${this.data.get('name')}[]`,
          index: this.currentIndex,
          input_classes: this.data.get('inputClasses'),
          placeholder: this.data.get('placeholder')
        }})
        const newRow = document.createElement('template')
        newRow.innerHTML = response.data
        this.rowsTarget.replaceChild(newRow.content.cloneNode(true), this.rowsTarget.querySelector(`div[data-index="${this.currentIndex}"]`))
      } catch (error) {
        console.log(error)
      }
    }
  }

  open() {
    this.currentIndex = parseInt(event.currentTarget.dataset.index, 10)
    this.cloudinaryWidget.open()
  }

  add() {
    this.currentIndex = -1
    this.cloudinaryWidget.open()
  }

  remove(event) {
    const indexToRemove = parseInt(event.currentTarget.dataset.index, 10)
    if (confirm('Are you sure you wish to remove this media item?')) {
      this.inputTargets[indexToRemove].value = ""
      this.rowsTarget.querySelector(`div[data-index="${indexToRemove}"]`).classList.add('is-hidden')
    }
  }

  async addBrowse() {
    this.currentIndex = -1
    const newPath = this.data.get('browsePath')
    this.boundCallbacks = {
      select: this.selectMediaCallback.bind(this),
      close: this.closeMediaCallback.bind(this)
    }
    document.querySelector('#yarii-cloudinary--modal-wrapper').addEventListener('selectCloudinaryMedia', this.boundCallbacks.select)
    document.querySelector('#yarii-cloudinary--modal-wrapper').addEventListener('closeCloudinaryMedia', this.boundCallbacks.close)

    try {
      const response = await axios.get(newPath)
      document.querySelector('#yarii-cloudinary--modal-wrapper').innerHTML = response.data
    } catch (error) {
      console.log(error)
    }
  }

  async browse(event) {
    this.currentIndex = parseInt(event.currentTarget.dataset.index, 10)
    const newPath = this.data.get('browsePath')
    this.boundCallbacks = {
      select: this.selectMediaCallback.bind(this),
      close: this.closeMediaCallback.bind(this)
    }
    document.querySelector('#yarii-cloudinary--modal-wrapper').addEventListener('selectCloudinaryMedia', this.boundCallbacks.select)
    document.querySelector('#yarii-cloudinary--modal-wrapper').addEventListener('closeCloudinaryMedia', this.boundCallbacks.close)

    try {
      const response = await axios.get(newPath)
      document.querySelector('#yarii-cloudinary--modal-wrapper').innerHTML = response.data
    } catch (error) {
      console.log(error)
    }
  }

  async selectMediaCallback(event) {
    const browseController = event.detail
    const publicId = browseController.selectedPublicId
    if (this.currentIndex == -1) {
      // when adding new images
      this.ids.push(publicId)
      this.updateIndex()
      const formItemPath = this.data.get('formItemPath').replace('/0/', `/${encodeURIComponent(publicId)}/`)
      try {
        const response = await axios.get(formItemPath, {params: {
          name: `${this.data.get('name')}[]`,
          index: this.latestIndex,
          input_classes: this.data.get('inputClasses'),
          placeholder: this.data.get('placeholder')
        }})
        const newRow = document.createElement('template')
        newRow.innerHTML = response.data
        this.rowsTarget.append(newRow.content.cloneNode(true))
      } catch (error) {
        console.log(error)
      }
    } else {
      const thumbnailImage = browseController.element.querySelector(`div[data-cloudinary-id="${publicId}"] figure`).innerHTML
      this.thumbnailTargets[this.currentIndex].innerHTML = `<figure class="image is-128x128 mb-3">${thumbnailImage}</figure>`
      this.inputTargets[this.currentIndex].value = publicId
    }
    browseController.closeModal()
  }

  closeMediaCallback(event) {
    const browseController = event.detail
    document.querySelector('#yarii-cloudinary--modal-wrapper').removeEventListener('selectCloudinaryMedia', this.boundCallbacks.select)
    document.querySelector('#yarii-cloudinary--modal-wrapper').removeEventListener('closeCloudinaryMedia', this.boundCallbacks.close)
    browseController.element.remove()
  }
}