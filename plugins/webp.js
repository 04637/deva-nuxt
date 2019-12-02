import Vue from 'vue'
import store from '../store/getters'

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
