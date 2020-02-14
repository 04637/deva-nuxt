import store from '../store/getters'
import Vue from 'vue'

Vue.filter('webp', (url) => {
  if (url.indexOf('oss-cdn.deva.wiki') <= -1) {
    return url
  }
  if (store.isSupportWebp) {
    return url + '?x-oss-process=style/webp'
  } else {
    return url + '?x-oss-process=style/jpg'
  }
})
