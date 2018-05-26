import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from './plugins'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/*
// Clear after module reload
window.addEventListener('message', e => {
    if ('production' !== process.env.NODE_ENV) {
        console.clear();
    }
});

*/
