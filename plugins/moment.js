import * as moment from 'moment'
import Vue from 'vue'
moment().locale('zh')
Vue.filter('moment', (v) => moment(v).format('YYYY-MM-DD HH:mm:ss'))
