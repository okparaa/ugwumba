// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { App } from './app';
import router from './router';
import store from './store';
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload)

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },  
});