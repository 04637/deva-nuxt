import $qs from 'qs'
const Cookie = require('js-cookie')

export default function({ store, redirect, app: { $axios } }) {
  // 参考 https://github.com/nuxt/nuxt.js/issues/2680
  // I don't know why I turned a blind eye on this at first. 这人可太搞笑了😄
  $axios.interceptors.request.use((request) => {
    // Get token from auth.js store
    const token = store.getters.getToken
    // Update token axios header
    if (token) {
      request.headers.common.Authorization = `${token}`
    }
    return request
  })
  $axios.onRequest((config) => {
    // 参考 https://github.com/nuxt-community/modules/issues/89  👍👍👍棒棒的
    $axios.setToken(store.getters.getToken)
    if (config.method === 'post') {
      config.data = $qs.stringify(config.data, { indices: false })
    }
  })
  $axios.onError((error) => {
    if (error.response && error.response.status === 401) {
      // 使外部api上的JWT Cookie失效
      Cookie.remove('userInfo')
      store.commit('setUserInfo', null)
      redirect('/user/login')
    }
  })
}
