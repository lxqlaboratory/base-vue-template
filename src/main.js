import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import echarts from 'echarts'
import '@/styles/index.scss' // global css
import moment from 'moment'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon

import BaiduMap from 'vue-baidu-map'
import splitPane from 'vue-splitpane'
import Toast from './utils/message'

/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(BaiduMap, { ak: 'YZk52XHYbwtDoWnnlDO53ysCNBHCG0v6' })
Vue.component('split-pane', splitPane)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(Toast)
Vue.prototype.$moment = moment
moment.locale('zh-cn')
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

