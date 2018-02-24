// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";

Vue.config.productionTip = false;
let store = [];
import VueStash from "vue-stash";
Vue.use(VueStash);
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  data: { store },
  template: "<App/>"
});
