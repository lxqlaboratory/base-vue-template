import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import echarts from 'echarts'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon

import BaiduMap from 'vue-baidu-map'

import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import splitPane from 'vue-splitpane'
import Stomp from 'stompjs'
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
Vue.use(VideoPlayer)
Vue.use(Stomp)
Vue.component('split-pane', splitPane)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(Toast);
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

const ws = new WebSocket('ws://202.194.14.72:15674/ws')
const client = Stomp.over(ws)
const on_connect = function() {
  console.log('connected')
  client.subscribe('JT808Server_LocationData_Queue', function(message) {
    const p = JSON.parse(message.body)
    console.log(p)
  })
  client.subscribe('JT808Server_DriverIdentity_Queue', function(message) {
    const p = JSON.parse(message.body)
    console.log(p)
  })
  client.subscribe('JT808Server_DigitWaybill_Queue', function(message) {
    const p = JSON.parse(message.body)
    console.log(p)
  })
}
const on_error = function() {
  console.log('error')
}
client.connect('admin', '123', on_connect, on_error, 'jt808')

