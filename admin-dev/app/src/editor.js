const axios = require("axios");

const DOMHelper = require("./dom-helper");
const EditorText = require("./editor-text");
const EditorImage = require("./editor-image");
const EditorMeta = require("./editor-meta");

require("./iframe-load");


module.exports = class Editor {
  constructor() {
    this.iframe = document.querySelector("iframe");
  }

  open(page, callback) {

    this.currentPage = page;

    axios
        .get("../" + page + "?rnd=" + Math.random())
        .then((res) => DOMHelper.parseStringToDom(res.data))
        .then(DOMHelper.wrapTextNodes)
        .then(DOMHelper.wrapImages)
        .then((dom) => {
          this.virtualDom = dom;
          return dom;
        })
        .then(DOMHelper.serializeDomToString)
        .then((html) => axios.post("./api/saveTempPage.php", { html }))
        .then(() => this.iframe.load("../temporary_file-no_use_qwertyytrewq1990.html"))
        .then(() => axios.post("./api/deleteTempPage.php"))
        .then(() => this.enableEditing())
        .then(() => this.injectStyles())
        .then(callback)
      }


  enableEditing() {
    this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach((element) => {
      const id = element.getAttribute("nodeid");
      const virtualElement =  this.virtualDom.body.querySelector(`[nodeid="${id}"]`);
      new EditorText(element, virtualElement);
    });

    this.iframe.contentDocument.body.querySelectorAll("[editableimgid]").forEach((element) => {
      const id = element.getAttribute("editableimgid");
      const virtualElement =  this.virtualDom.body.querySelector(`[editableimgid="${id}"]`);
      new EditorImage(element, virtualElement);
    });


    this.metaEditor = new EditorMeta(this.virtualDom);
  }

  injectStyles() { 
    const style = this.iframe.contentDocument.createElement("style");
    style.innerHTML = `
      text-editor:hover {
        outline: 1px solid #a9a9a9;
        outline-offset: 8px;
      }
      text-editor:focus {
        outline: 1px solid #000;
        outline-offset: 8px;
      }
      [editableimgid]:hover {
        outline: 1px solid #a9a9a9;
        outline-offset: 8px;
      }
      [editableimgid]:focus {
        outline: 1px solid #000;
        outline-offset: 8px;
      }
    `;
    this.iframe.contentDocument.head.appendChild(style);
  }



  save(onSucces, onError) {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    DOMHelper.unwrapImages(newDom);
    const html = DOMHelper.serializeDomToString(newDom);
    axios
        .post("./api/savePage.php", { pageName: this.currentPage,  html })
        .then(onSucces)
        .catch(onError);
  }
}











    //First lesson work with iframe  (add to open() function)

    // this.iframe.load("../" + page, () => {
    //   const body = this.iframe.contentDocument.body;

    //   let textNodes = [];

    //   function recursy(element) {
    //     element.childNodes.forEach((node) => {
    //       if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0) {
    //         textNodes.push(node);
    //       } else {
    //         recursy(node);
    //       }

    //     });
    //   }

    //   recursy(body);

    //   textNodes.forEach((node) => {
    //     const wrapper = this.iframe.contentDocument.createElement("text-editor");
    //     node.parentNode.replaceChild(wrapper, node);
    //     wrapper.appendChild(node);
    //     wrapper.contentEditable = "true";
    //   })


    // })