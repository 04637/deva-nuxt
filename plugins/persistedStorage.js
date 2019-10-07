import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
// https://www.npmjs.com/package/vuex-persist 解决刷新state丢失的问题
// @See https://github.com/robinvdvleuten/vuex-persistedstate
export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'deva',
      storage: {
        getItem: (key) => Cookies.get(key),
        // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 7, path: '/' }),
        removeItem: (key) => Cookies.remove(key)
      }
    })(store)
  })
}
