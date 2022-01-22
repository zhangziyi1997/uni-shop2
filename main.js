import App from './App'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
// 挂载在uni上
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'
// 配置请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}

// 配置响应拦截器
$http.afterRequest = function () {
  uni.hideLoading()
}



// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif