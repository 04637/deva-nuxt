import VuexPersistence from 'vuex-persist'
// https://www.npmjs.com/package/vuex-persist 解决刷新state丢失的问题
export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      storage: window.sessionStorage
    }).plugin(store)
  })
}
