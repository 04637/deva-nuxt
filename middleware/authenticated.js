export default function({ store, redirect }) {
  // 如果用户未经过身份验证 https://zh.nuxtjs.org/examples/auth-external-jwt
  if (!store.state.userInfo) {
    return redirect('/user/login')
  }
}
