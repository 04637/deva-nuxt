const cookieparser = process.server ? require('cookieparser') : undefined

export default {
  nuxtServerInit({ commit }, { req }) {
    let userInfo = null
    let darkTheme = false
    let useMarkdown = false
    let miniNav = false
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      if (parsed.vuex) {
        // 要先检查, 再解析 https://stackoverflow.com/questions/13022178/uncaught-syntaxerror-unexpected-token-u-json
        userInfo = JSON.parse(parsed.vuex).userInfo
        darkTheme = JSON.parse(parsed.vuex).darkTheme
        useMarkdown = JSON.parse(parsed.vuex).useMarkdown
        miniNav = JSON.parse(parsed.vuex).miniNav
      }
    }
    commit('setUserInfo', userInfo)
    commit('setDarkTheme', darkTheme)
    commit('setUseMarkdown', useMarkdown)
    commit('setMiniNav', miniNav)
  }
}
