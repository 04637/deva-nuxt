import Vue from 'vue'
Vue.filter('filterHtml', (v) => v.replace(/<[^>]*>/g, ''))
