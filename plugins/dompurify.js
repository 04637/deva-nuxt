// 替代 v-html https://www.npmjs.com/package/vue-dompurify-html
import Vue from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'

Vue.use(VueDOMPurifyHTML, {
  namedConfigurations: {
    noHtml: {
      USE_PROFILES: { html: false }
    }
  }
})
