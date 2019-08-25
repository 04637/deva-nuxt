import createPersistedState from 'vuex-persistedstate'
// @Deprecated https://www.npmjs.com/package/vuex-persist 解决刷新state丢失的问题
// @See https://github.com/robinvdvleuten/vuex-persistedstate
export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'deva',
      // storage: window.sessionStorage
      storage: window.sessionStorage
    })(store)
  })
}
