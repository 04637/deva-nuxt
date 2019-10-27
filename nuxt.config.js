import colors from 'vuetify/es5/util/colors'
const api = 'localhost:8080'
const redirectUri = 'http://localhost:3000/user/login?auth='
export default {
  mode: 'universal',
  domain: 'http://localhost:3000',
  githubLoginUrl:
    'https://github.com/login/oauth/authorize?client_id=174cf0a9106fd1c53d24&scope=user:id',
  gitlabLoginUrl:
    'https://gitlab.com/oauth/authorize?client_id=c42e2553ea1eb4a95d8db0a01b0255a26c4a0bf476f34e94fba77432859ec5cd' +
    '&response_type=code&redirect_uri=' +
    redirectUri +
    'gitlab' +
    '&scope=read_user',
  stackOverflowLoginUrl:
    'https://stackoverflow.com/oauth?client_id=16509&scope=read_inbox' +
    '&redirect_uri=http://localhost:3000/user/login?auth=stackOverflow',
  googleLoginUrl:
    'https://accounts.google.com/o/oauth2/v2/auth' +
    '?redirect_uri=' +
    redirectUri +
    'google' +
    '&response_type=code&client_id=102188439022-dk2vafrfd5a50h8rhhpctnf8lj00u8at.apps.googleusercontent.com' +
    '&scope=https://www.googleapis.com/auth/plus.me+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile',
  server: {
    port: 3000
  },
  /*
   ** Headers of the page
   */
  head: {
    // titleTemplate: '%s - ' + process.env.npm_package_name,
    titleTemplate: '%s',
    title: 'DEVA - 开发者的专属社区',
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
    script: [{ src: '//at.alicdn.com/t/font_778737_c81ibq34pph.js' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'rgba(1,166,135,0.38)' },
  // loading: false,
  /*
   ** Global CSS
   */
  css: [
    '~assets/css/common.css',
    'material-design-icons-iconfont/dist/material-design-icons.css',
    // markdown-it 高亮 https://samuelcoe.com/blog/nuxt-markdownit-highlight/
    { src: '~node_modules/highlight.js/styles/sunburst.css', lang: 'css' }
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
    { src: '~plugins/i18n', ssr: false },
    { src: '~plugins/clipboard', ssr: false },
    { src: '~plugins/websocket', ssr: false },
    { src: '~plugins/notice', ssr: false },
    // https://surmon-china.github.io/vue-quill-editor/
    { src: '~plugins/quill-editor', ssr: false },
    { src: '~/plugins/persistedStorage', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
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
    // baseURL: 'http://localhost:8080',
    baseURL: 'http://' + api,
    debug: false
  },
  websocket: {
    // server: 'ws://localhost:8080/'
    server: 'ws://' + api + '/'
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
          // success: colors.green.accent3,
          success: '#01a687',
          sub: colors.grey.lighten1,
          background_color: '#303030',
          new_orange: '#d14435',
          private: colors.pink,
          my_gray: '#d3d3d3',
          solo_color: '#424242',
          inverted_color: colors.white
        },
        light: {
          // primary: colors.cyan,
          primary: '#01a687',
          background_color: '#fafafa',
          new_orange: '#ff6600',
          private: colors.pink,
          my_gray: '#808080',
          solo_color: colors.white,
          inverted_color: colors.black
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
    use: [
      'markdown-it-div',
      'markdown-it-attrs',
      'markdown-it-emoji',
      'markdown-it-highlightjs'
    ]
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
