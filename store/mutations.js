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
  }
}
