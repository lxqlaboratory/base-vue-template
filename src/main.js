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
Vue.use(Toast)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})


