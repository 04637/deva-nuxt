<template>
  <v-container justify-center align-start>
    <v-layout column>
      <v-card-title>登录</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center>
      <v-card class="pa-8 mt-6" width="520px">
        <v-form ref="form">
          <v-layout justify-center>
            <img src="/deva.png" alt="" class="logo-md" />
          </v-layout>
          <v-layout class="mt-3" column>
            <v-text-field
              v-model="username"
              hint="输入用户名或绑定手机号码"
              label="用户名/手机号"
              outlined
              required
              :rules="[(v) => (!v ? '请输入用户名/手机号' : true)]"
              class="mt-4"
            ></v-text-field>
            <v-text-field
              v-model="password"
              class="mt-4"
              label="密码"
              outlined
              :rules="[(v) => (!v ? '请输入密码' : true)]"
              required
              @keyup.enter.native="submitLogin"
            ></v-text-field>
            <v-layout justify-end class="mt-4">
              <v-btn
                outlined
                accent
                depressed
                min-width="150px"
                :loading="loading"
                @click="submitLogin"
                >登录</v-btn
              >
            </v-layout>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
    <v-layout justify-center>
      <v-card class="pa-8 mt-6" width="520px">
        <v-layout justify-center>
          <v-btn text depressed to="signUp"
            >还没有账号？<span style="color: orange">去注册</span></v-btn
          >
        </v-layout>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  data: () => ({
    show: false,
    username: '',
    password: '',
    loading: false
  }),
  middleware: 'notAuthenticated',
  methods: {
    submitLogin() {
      if (!this.$refs.form.validate()) {
        return false
      }
      this.loading = true
      const _this = this
      this.$axios
        .$post('/userInfo/login', {
          username: this.username,
          email: this.username,
          password: this.password
        })
        .then((resp) => {
          _this.loading = false
          if (resp.succeed) {
            _this.$store.commit('setUserInfo', resp.data)
            // 参考 https://zh.nuxtjs.org/examples/auth-external-jwt 跨域身份验证
            Cookie.set('userInfo', resp.data)
            _this.$router.go(-1)
          }
        })
    }
  }
}
</script>

<style scoped></style>
