import Vue from 'vue'

Vue.prototype.$checkLogin = function() {
  if (!this.$store.state.userInfo) {
    this.$router.push('/user/login')
  }
}
