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
  }
}
