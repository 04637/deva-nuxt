export default {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setAvatar(state, newAvatar) {
    if (state.userInfo) {
      state.userInfo.avatar = newAvatar
    }
  },
  setUnreadMessageCount(state, m) {
    if (state.userInfo) {
      state.unReadMessageCount = m
    }
  },
  setErrorMsg(state, msg) {
    state.systemError.msg = msg
  },
  needReloadSpaceList(state) {
    state.reloadSpaceFlag++
  },
  needAlertError(state) {
    state.systemError.alertFlag++
  },
  setDarkTheme(state, val) {
    state.darkTheme = val
  },
  toggleDarkTheme(state) {
    state.darkTheme = !state.darkTheme
  },
  setMonitorInterval(state, val) {
    state.monitorInterval = val
  },
  setShowFooter(state, val) {
    state.showFooter = val
  },
  toggleUseMarkdown(state) {
    state.useMarkdown = !state.useMarkdown
  }
}
