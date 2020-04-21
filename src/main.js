import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import App from './AppTables.vue'

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
