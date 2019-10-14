import { Controller } from "stimulus"
//import cloudinary from "cloudinary-core"

export default class extends Controller {
  connect() {
    // Not currently used…
/*    this.cl = new cloudinary.Cloudinary({cloud_name: this.data.get("cloud"), secure: true}); */
    console.log("Modal exists")
  }

  selectMedia(event) {
    this.selectedPublicId = event.currentTarget.dataset.cloudinaryId
    const customEvent = new CustomEvent('selectCloudinaryMedia', { bubbles: true, detail: this })
    this.element.dispatchEvent(customEvent)
  }

  closeModal() {
    const customEvent = new CustomEvent('closeCloudinaryMedia', { bubbles: true, detail: this })
    this.element.dispatchEvent(customEvent)
  }
}