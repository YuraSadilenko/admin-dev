const axios = require("axios");

module.exports = class EditorImage {
  constructor(element, virtualElement) {
    this.element = element;
    this.virtualElement = virtualElement;

    this.element.addEventListener("click", () => this.onClick());

    this.imgUploader = document.querySelector("#image-upload");
  }

  onClick() {
    this.imgUploader.click();

    this.imgUploader.onchange = () => {
      if(this.imgUploader.files && this.imgUploader.files[0]) {
        window.vue.enableLoader();
        let formData = new FormData();
        formData.append("image", this.imgUploader.files[0]);

        axios
            .post("./api/uploadImage.php", formData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then((res) => {
              this.virtualElement.src = this.element.src = "/img/" +  res.data.src;
            })
            .catch(() => window.vue.errorNotification("Image loading error!"))
            .finally(() => {
              this.imgUploader.value = "";
              window.vue.disableLoader();
            })
      }
    }
  }
} 