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
  getReloadSpaceFlag(state) {
    return state.reloadSpaceFlag
  },
  getAlertErrorFlag(state) {
    return state.systemError.alertFlag
  },
  isDarkTheme(state) {
    return state.darkTheme
  },
  getMonitorInterval(state) {
    return state.monitorInterval
  },
  getShowFooter(state) {
    return state.showFooter
  },
  getUseMarkdown(state) {
    return state.useMarkdown
  }
}
