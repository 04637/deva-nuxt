import $qs from 'qs'

export default function({ store, redirect, app: { $axios } }) {
  $axios.onRequest((config) => {
    // 参考 https://github.com/nuxt-community/modules/issues/89  👍👍👍棒棒的
    $axios.setToken(
      store.state.userInfo ? store.getters.getUserInfo.token : null
    )
    if (config.method === 'post') {
      config.data = $qs.stringify(config.data, { indices: false })
    }
  })
  $axios.onError((error) => {
    if (error.response.status === 401) {
      store.commit('setUserInfo', null)
      redirect('/user/login')
    }
  })
}
