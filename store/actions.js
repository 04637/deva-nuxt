const cookieparser = process.server ? require('cookieparser') : undefined

export default {
  nuxtServerInit({ commit }, { req }) {
    let userInfo = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      if (parsed.vuex) {
        // 要先检查, 再解析 https://stackoverflow.com/questions/13022178/uncaught-syntaxerror-unexpected-token-u-json
        userInfo = JSON.parse(parsed.vuex).userInfo
      }
    }
    commit('setUserInfo', userInfo)
  }
}
