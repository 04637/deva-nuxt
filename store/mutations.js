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
  setShowFooter(state, val) {
    state.showFooter = val
  },
  toggleUseMarkdown(state) {
    state.useMarkdown = !state.useMarkdown
  },
  setUseMarkdown(state, val) {
    state.useMarkdown = val
  },
  toggleMiniNav(state) {
    state.miniNav = !state.miniNav
  },
  setMiniNav(state, val) {
    state.miniNav = val
  },
  supportWebp(state) {
    state.webpSupport = true
  }
}
