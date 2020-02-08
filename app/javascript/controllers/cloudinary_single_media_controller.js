import { Controller } from "stimulus"
import axios from "axios"

export default class extends Controller {
  static targets = ["thumbnail", "input"]

  connect() {
    const uploadPreset = this.data.get('uploadPreset') || 'yarii_editor'

    this.cloudinaryWidget = cloudinary.createUploadWidget({
      cloudName: this.data.get('cloud'),
      multiple: false,
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

  async widgetSuccessCallback(result) {
    const publicId = result.public_id
    this.inputTarget.value = publicId
    const formThumbnailPath = this.data.get('formThumbnailPath').replace('/0/', `/${encodeURIComponent(publicId)}/`)
    try {
      const response = await axios.get(formThumbnailPath)
      this.thumbnailTarget.innerHTML = response.data
    } catch (error) {
      console.log(error)
    }
  }

  open() {
    this.cloudinaryWidget.open()
  }

  async browse() {
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

  selectMediaCallback(event) {
    const browseController = event.detail
    const publicId = browseController.selectedPublicId
    const thumbnailImage = browseController.element.querySelector(`div[data-cloudinary-id="${publicId}"] figure`).innerHTML
    this.thumbnailTarget.innerHTML = `<figure class="image is-128x128 mb-3">${thumbnailImage}</figure>`
    this.inputTarget.value = publicId
    browseController.closeModal()
  }

  closeMediaCallback(event) {
    const browseController = event.detail
    document.querySelector('#yarii-cloudinary--modal-wrapper').removeEventListener('selectCloudinaryMedia', this.boundCallbacks.select)
    document.querySelector('#yarii-cloudinary--modal-wrapper').removeEventListener('closeCloudinaryMedia', this.boundCallbacks.close)
    browseController.element.remove()
  }
}