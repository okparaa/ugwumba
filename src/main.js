// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from 'vue';
import { App } from './app';
import router from './router';
import store from './store';
import VueLazyload from 'vue-lazyload';
import vueBrowserUpdate from 'vue-browserupdate';
Vue.use(vueBrowserUpdate, {
  options: {
    container: document.body,
  }
});
Vue.use(VueLazyload)
router.beforeEach((to, from, next) => {
  store.commit('accounts/IS_LOADING', true);
  next();
});

router.afterEach((to, from) => {
  store.commit('accounts/IS_LOADING', false);
});

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },  
});