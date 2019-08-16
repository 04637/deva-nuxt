import { format } from 'timeago.js'
import Vue from 'vue'
Vue.filter('timeago', (v) => format(v, 'zh_CN'))
