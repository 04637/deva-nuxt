import VueI18n from 'vue-i18n'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(VueI18n)

const messages = {
  en: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: '啊哈哈哈:',
        pageText: '{0}-{1} of {2}'
      }
    }
  },
  sv: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: '啊哈哈哈:',
        pageText: '{0}-{1} av {2}'
      }
    }
  }
}
const i18n = new VueI18n({
  locale: 'sv',
  messages
})
export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})
