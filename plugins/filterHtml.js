import Vue from 'vue'
// deprecated 使用 dom-purify https://github.com/cure53/DOMPurify#can-i-configure-dompurify
Vue.filter('filterHtml', (v) => v.replace(/<[^>]*>/g, ''))
