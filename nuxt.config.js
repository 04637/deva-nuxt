import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    // titleTemplate: '%s - ' + process.env.npm_package_name,
    titleTemplate: '%s',
    title: process.env.npm_package_name || 'DEVA',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '~assets/css/common.css',
    'material-design-icons-iconfont/dist/material-design-icons.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/axios',
    '~plugins/timeago',
    '~plugins/filterHtml',
    '~plugins/common',
    { src: '~plugins/quill-editor', ssr: false },
    { src: '~/plugins/sessionStorage', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://localhost:8088',
    debug: false
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.cyan,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          error: colors.orange,
          success: colors.green.accent3,
          sub: colors.grey.lighten1
        },
        light: {
          primary: colors.cyan
        }
      }
    }
  },

  // [optional] markdownit options
  // See https://github.com/markdown-it/markdown-it
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    injected: true,
    emoji: true,
    html: true,
    use: ['markdown-it-div', 'markdown-it-attrs', 'markdown-it-emoji']
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev, isClient }) {
      // 参考 https://github.com/nuxt/nuxt.js/issues/2781 🐮🍺  👍👍👍 js调试
      if (isDev) {
        config.devtool = 'eval-source-map'
      }
    }
  }
}
