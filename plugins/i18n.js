// 国际化  参考 https://vuetifyjs.com/en/customization/internationalization#api
import zhHans from 'vuetify/es5/locale/zh-Hans'

export default ({ $vuetify }) => {
  $vuetify.lang.locales = { zhHans }
  $vuetify.lang.current = 'zhHans'
}
