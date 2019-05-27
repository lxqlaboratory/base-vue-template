import Vue from 'vue'
import ToastComponent from '../components/Message/Message.vue'

const Toast = {}; // 注册Toast
Toast.install = function (Vue) {
  const ToastConstructor = Vue.extend(ToastComponent)
  const instance = new ToastConstructor();
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  Vue.prototype.$toast = (msg, duration = 1500) => {
    instance.message = msg;
    instance.visible = true;
    /*setTimeout(() => {
      instance.visible = false;
    }, duration);*/
  }
}
export default Toast
