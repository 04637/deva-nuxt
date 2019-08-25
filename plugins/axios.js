import $qs from 'qs'

export default function({ store, redirect, app: { $axios } }) {
  $axios.onRequest((config) => {
    // 参考 https://github.com/nuxt-community/modules/issues/89  👍👍👍棒棒的
    $axios.setToken(
      store.getters.getUserInfo ? store.getters.getUserInfo.token : null
      // store.getters.getUserInfo.token
      // window.sessionStorage.getItem('userInfo')
    )
    if (config.method === 'post') {
      config.data = $qs.stringify(config.data, { indices: false })
    }
  })
  $axios.onError((error) => {
    if (error.response && error.response.status === 401) {
      store.commit('setUserInfo', null)
      redirect('/user/login')
    }
  })
}
