import $qs from 'qs'

export default function({ store, app: { $axios } }) {
  $axios.onRequest((config) => {
    // 参考 https://github.com/nuxt-community/modules/issues/89  👍👍👍棒棒的
    $axios.setToken(
      store.state.userInfo ? store.getters.getUserInfo.token : null
    )
    config.data = $qs.stringify(config.data)
  })
}
