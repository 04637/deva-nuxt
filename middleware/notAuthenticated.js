export default function({ store, redirect, router }) {
  // 如果用户通过身份验证, 则重定向至主页 https://zh.nuxtjs.org/examples/auth-external-jwt
  if (store.state.userInfo) {
    return redirect('/')
  }
}
