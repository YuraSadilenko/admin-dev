// Create new html pages/ Tasks from first 4 lessons

// const Vue = require("vue");
// const axios = require("axios");

// const { default: axios } = require("axios");


// new Vue({
//   el: '#app',
//   data: {
//     pageList: [],
//     newPageName: ""
//   },
//   methods: {
//     createPage() {
//       axios
//           .post("./api/createNewHtmlPage.php", { "name": this.newPageName })
//           .then(() => this.updatePageList())
//     },
//     updatePageList() {
//       axios
//           .get("./api/api.php")
//           .then((response) => {
//             this.pageList = response.data
//           })
//     },
//     deletePage(page) {
//       axios
//           .post("./api/deletePage.php", { "name": page })
//           .then(() => this.updatePageList())
//     }
//   },
//   created() {
//     this.updatePageList();
//   },
// })


// Iframe lessons

const Editor = require("./editor");
const UIkit = require("uikit");
const axios = require("axios");
import { post } from 'jquery';
import Vue from '../src/vue';

window.editor = new Editor();


window.vue = new Vue({
  el: "#app",
  data: {
    page: "index.html",
    showLoader: true,
    sideBarStyle: false,
    backupsList: [],
    pageList: [],

    meta: {
      title: "",
      keywords: "",
      description: ""
    },

    auth: false,
    password: "",
    loginError: false,
  },

  methods: {
    onBtnSave() {
      this.showLoader = true;
      window.editor.save(
        () => {
          this.loadBackupList();
          this.showLoader = false;
          UIkit.notification({message: 'Page is successfully updated!', status: 'success'});
        },
        () => {
          this.showLoader = false;
          UIkit.notification({message: 'Publish failed!', status: 'danger'});
      });
    },

    sideBarOpen() {
      this.sideBarStyle = true;
    },

    sideBarClose() {
      this.sideBarStyle = false;
    },

    openPage(page) {
      this.page = page;
      this.loadBackupList();
      this.showLoader = true;

      window.editor.open(page, () => {
        this.showLoader = false;
        this.meta = window.editor.metaEditor.getMeta();
      }); 
    },

    loadBackupList() {
      axios
          .get("./backups/backups.json")
          .then((res) => {
            this.backupsList = res.data.filter((backup) => {
              return (backup.page === this.page);
            });
          })
    },

    restoreBackup(backup) {
        UIkit.modal
          .confirm('Are you sure you want to go back to this backup?',
            { labels: {ok: "Restore", cancel: "Cancel" } }
          )
          .then(() => {
            this.showLoader = true;
            return axios.post("./api/restoreBackup.php", { "page": this.page, "file": backup.file })
          })
          .then(() => {
            this.openPage(this.page);
          })
    },

    applyMeta() {
      window.editor.metaEditor.setMeta(this.meta.title, this.meta.keywords, this.meta.description);
    },

    login() {
      if(this.password.length > 5) { 
        axios
            .post("./api/login.php", { "password": this.password })
            .then((res) => {
              if(res.data.auth === true) {
                this.auth = true;
                this.start();
              } else {
                this.loginError = true;
              }
            })
      } else {
        this.loginError = true;
      }
    },

    logout() {
      axios
          .get("./api/logout.php")
          .then(() => {
            window.location.replace("/");
          })
    },

    start() {
      this.openPage(this.page);
      axios
          .get("./api/pageList.php")
          .then((res) => {
            this.pageList = res.data;
          });
          this.loadBackupList();
    },

    enableLoader() {
      this.showLoader = true;
    },

    disableLoader() {
      this.showLoader = false;
    },

    errorNotification(message) {
      UIkit.notification({message: message, status: "danger"});
    }
  },
  created() {
    axios
        .get("./api/checkAuth.php")
        .then((res) => {
          if(res.data.auth === true) {
            this.auth = true;
            this.start();
          }
        });


  },
})