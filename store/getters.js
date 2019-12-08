export default {
  getUserInfo(state) {
    return state.userInfo
  },
  getToken(state) {
    return state.userInfo ? state.userInfo.token : null
  },
  getUserType(state) {
    return state.userInfo ? state.userInfo.userType : null
  },
  isAdmin(state) {
    return state.userInfo ? state.userInfo.userType === 'ADMIN' : false
  },
  getUserId(state) {
    return state.userInfo ? state.userInfo.userId : null
  },
  getRep(state) {
    return state.userInfo ? state.userInfo.reputation : null
  },
  getUnReadMessageCount(state) {
    return state.userInfo ? state.unReadMessageCount : null
  },
  getErrorMsg(state) {
    return state.systemError.msg
  },
  getAlertErrorFlag(state) {
    return state.systemError.alertFlag
  },
  getShowFooter(state) {
    return state.showFooter
  },
  getUseMarkdown(state) {
    return state.useMarkdown
  },
  isSupportWebp(state) {
    return state.webpSupport
  }
}
