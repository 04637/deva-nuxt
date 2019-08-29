const cookieparser = process.server ? require('cookieparser') : undefined

export default {
  nuxtServerInit({ commit }, { req }) {
    let userInfo = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      userInfo = JSON.parse(parsed.userInfo)
    }
    commit('setUserInfo', userInfo)
  }
}
