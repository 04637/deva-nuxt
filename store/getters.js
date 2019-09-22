export default {
  getUserInfo(state) {
    return state.userInfo
  },
  getToken(state) {
    return state.userInfo ? state.userInfo.token : null
  },
  getUserId(state) {
    return state.userInfo ? state.userInfo.userId : null
  },
  getUnReadMessageCount(state) {
    return state.userInfo ? state.unReadMessageCount : null
  }
}
