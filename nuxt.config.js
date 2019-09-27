import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  domain: 'http://localhost:3000',
  /*
   ** Headers of the page
   */
  head: {
    // titleTemplate: '%s - ' + process.env.npm_package_name,
    titleTemplate: '%s',
    title: process.env.npm_package_name || 'DEVA - 开发者的专属问答社区',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    // 参考 https://zh.nuxtjs.org/faq 引入外部资源
    script: [{ src: '//at.alicdn.com/t/font_778737_h1fxdq5w8ae.js' }]
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
    '~plugins/moment',
    '~plugins/filterHtml',
    '~plugins/common',
    '~plugins/dompurify',
    { src: '~plugins/websocket', ssr: false },
    { src: '~plugins/notice', ssr: false },
    { src: '~plugins/quill-editor', ssr: false },
    { src: '~/plugins/persistedStorage', ssr: false }
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
  websocket: {
    server: 'ws://localhost:8088/'
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
          primary: '#01a687',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.orange,
          // error: colors.deepOrange.accent4,
          error: colors.orange,
          success: colors.green.accent3,
          sub: colors.grey.lighten1,
          background_color: '#303030',
          new_orange: '#d14435',
          private: colors.pink,
          my_gray: '#d3d3d3',
          solo_color: '#424242'
        },
        light: {
          // primary: colors.cyan,
          primary: '#01a687',
          background_color: '#fafafa',
          new_orange: '#ff6600',
          private: colors.pink,
          my_gray: '#808080',
          solo_color: colors.white
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
