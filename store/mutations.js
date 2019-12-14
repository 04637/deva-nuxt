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
  needAlertError(state) {
    state.systemError.alertFlag++
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
  setTransparentHeader(state, val) {
    state.transparentHeader = val
  },
  supportWebp(state) {
    state.webpSupport = true
  },
  setPhoneDialog(state, val) {
    state.phoneDialog = val
  }
}
