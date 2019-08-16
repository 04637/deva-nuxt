<template>
  <v-container justify-center align-start>
    <v-layout column>
      <v-card-title>登录</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center>
      <v-form ref="form" class="form">
        <v-layout justify-center>
          <img src="/deva.png" alt="" class="logo" />
        </v-layout>
        <v-layout class="mt-3" column>
          <v-text-field
            v-model="username"
            hint="输入用户名或绑定邮箱"
            label="用户名/邮箱"
            outlined
            required
            :rules="[(v) => (!v ? '请输入用户名/邮箱' : true)]"
            class="mt-4"
          ></v-text-field>
          <v-text-field
            v-model="password"
            class="mt-4"
            label="密码"
            outlined
            :rules="[(v) => (!v ? '请输入密码' : true)]"
            required
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
    </v-layout>
    <v-layout justify-center>
      <v-form class="form">
        <v-layout justify-center>
          <v-btn text depressed to="signUp"
            >还没有账号？<span style="color: orange">去注册</span></v-btn
          >
        </v-layout>
      </v-form>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    show: false,
    username: '',
    password: '',
    loading: false
  }),
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
            _this.$router.push({ path: '/' })
            _this.$store.commit('setUserInfo', resp.data)
          }
        })
    }
  }
}
</script>

<style scoped>
.logo {
  width: 100px;
  display: block;
}

.form {
  width: 500px;
  margin-top: 100px;
  border: 1px solid rgb(193, 193, 193);
  padding: 30px;
}
</style>
