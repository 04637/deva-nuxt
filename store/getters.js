export default {
  getUserInfo(state) {
    return state.userInfo
  },
  getToken(state) {
    return state.userInfo ? state.userInfo.token : null
  }
}
