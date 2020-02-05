// 参考 https://willbrowning.me/reducing-the-vendor-bundle-size-in-nuxt-js/ 优化包体积, 替换掉moment
import Vue from 'vue'
import 'dayjs/locale/zh-cn'
const dayjs = require('dayjs')
dayjs.locale('zh-cn')
Vue.filter('moment', (v) => {
  return dayjs(v).format('YYYY-M-D H:m:s')
})
