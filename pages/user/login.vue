<template>
  <v-app>
    <v-layout column shrink>
      <v-card-title>登录</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center shrink>
      <v-card class="pa-8 mt-6" width="520px">
        <logo type="form"></logo>
        <v-form ref="form">
          <!-- 用户名密码登录 -->
          <v-layout v-if="usernameLogin" class="mt-3" column>
            <v-text-field
              v-model="username"
              placeholder="用户名"
              outlined
              required
              class="mt-4"
            ></v-text-field>
            <v-text-field
              v-model="password"
              class="mt-4"
              placeholder="密码"
              outlined
              required
              type="password"
              @keyup.enter.native="submitLogin"
            ></v-text-field>
            <v-layout justify-space-between align-center class="mt-4">
              <v-btn
                x-small
                text
                depressed
                color="primary"
                @click="usernameLogin = false"
                >短信验证码登录</v-btn
              >
              <v-btn
                color="primary"
                accent
                depressed
                min-width="150px"
                :loading="loading"
                @click="submitLogin"
                >登录</v-btn
              >
            </v-layout>
          </v-layout>
          <!-- 短信验证码登录 -->
          <v-layout v-if="!usernameLogin" class="mt-3" column>
            <v-layout align-center>
              <v-text-field
                v-model="phone"
                label="绑定手机号"
                required
                class="mt-4"
              ></v-text-field>
            </v-layout>
            <v-layout align-center>
              <v-text-field
                v-model="smsCode"
                style="width: 100px"
                class="mt-4"
                label="验证码"
                required
                @keyup.enter.native="submitLogin"
              ></v-text-field>
              <v-btn
                v-show="smsCodeResult.timeInterval <= 0"
                class="ml-5"
                text
                outlined
                small
                :loading="smsCodeResult.loading"
                @click="sendSmsCode"
                >获取验证码</v-btn
              >
              <v-btn
                v-show="smsCodeResult.timeInterval > 0"
                class="ml-5"
                text
                outlined
                small
                disabled
                >{{ smsCodeResult.timeInterval }}&nbsp;s后重发</v-btn
              >
            </v-layout>
            <v-layout justify-space-between align-center class="mt-4">
              <v-btn
                x-small
                text
                depressed
                color="primary"
                @click="usernameLogin = true"
                >用户名密码登录</v-btn
              >
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
          <v-layout class="mt-1 pl-1" align-center>
            <a :href="githubLoginUrl" style="text-decoration: none"
              ><v-btn icon><v-icon>mdi-github-circle</v-icon></v-btn></a
            >
            <!--<v-btn icon class="ml-1"><v-icon>mdi-wechat</v-icon></v-btn>-->
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
    <v-layout justify-center shrink>
      <v-card class="pa-8 mt-6" width="520px">
        <v-layout justify-center>
          <v-btn text depressed to="signUp"
            >还没有账号？<span style="color: orange">去注册</span></v-btn
          >
        </v-layout>
      </v-card>
    </v-layout>
    <InfoDialog
      :msg="['', loginResp && loginResp.msg]"
      :succeed="loginResp.succeed"
      :dialog="dialog"
      @update:dialog="dialog = $event"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['验证码发送成功', '验证码发送失败, 请稍后重试']"
      :succeed="smsCodeResult.resp != null && smsCodeResult.resp.succeed"
      :dialog="smsCodeResult.dialog"
      @update:dialog="smsCodeResult.dialog = $event"
    >
    </InfoDialog>
  </v-app>
</template>
<script>
import Logo from '../../components/Logo'
import InfoDialog from '../../components/InfoDialog'
import config from '../../nuxt.config.js'
export default {
  components: {
    Logo,
    InfoDialog
  },
  data: () => ({
    username: '',
    password: '',
    phone: null,
    smsCode: null,
    loading: false,
    loginResp: {
      succeed: false
    },
    smsCodeResult: {
      dialog: false,
      resp: null,
      loading: false,
      timeInterval: 0
    },
    dialog: false,
    usernameLogin: true,
    githubLoginUrl: config.githubLoginUrl
  }),
  mounted() {
    this.githubLogin()
  },
  created() {},
  middleware: 'notAuthenticated',
  methods: {
    githubLogin() {
      if (this.$route.query.code) {
        this.loading = true
        this.$axios
          .$post('/userInfo/githubLogin', {
            code: this.$route.query.code
          })
          .then((resp) => {
            this.loading = false
            if (resp.succeed) {
              this.$store.commit('setUserInfo', resp.data)
              this.$router.push('/')
            } else {
              this.loginResp = resp
              this.dialog = true
            }
          })
          .catch((e) => {
            this.loading = false
          })
      }
    },
    submitLogin() {
      const _this = this
      const _data = {}
      let _url
      if (this.usernameLogin) {
        if (!this.username || !this.password) {
          return false
        }
        _url = '/userInfo/login'
        _data.username = this.username
        _data.password = this.password
      } else {
        if (!this.phone || !this.smsCode) {
          return false
        }
        _url = '/userInfo/smsLogin'
        _data.phone = this.phone
        _data.smsCode = this.smsCode.trim()
      }
      this.loading = true
      this.$axios
        .$post(_url, _data)
        .then((resp) => {
          _this.loading = false
          if (resp.succeed) {
            _this.$store.commit('setUserInfo', resp.data)
            // 参考 https://zh.nuxtjs.org/examples/auth-external-jwt 跨域身份验证
            _this.$router.go(-1)
          } else {
            this.loginResp = resp
            this.dialog = true
          }
        })
        .catch((e) => {
          _this.loading = false
        })
    },
    sendSmsCode() {
      if (!this.phone) {
        return false
      }
      if (this.smsCodeResult.timeInterval > 0) {
        this.smsCodeResult.showSendWarning = true
        return false
      }
      this.smsCodeResult.loading = true
      this.$axios
        .$post('/sms/sendCode', {
          phone: this.phone
        })
        .then((resp) => {
          this.smsCodeResult.resp = resp
          this.smsCodeResult.loading = false
          if (!resp.succeed) {
            this.smsCodeResult.dialog = true
          }
          const _self = this
          _self.smsCodeResult.timeInterval = 60
          const _interval = setInterval(function() {
            _self.smsCodeResult.timeInterval--
            if (_self.smsCodeResult.timeInterval <= 0) {
              clearInterval(_interval)
            }
          }, 1000)
        })
        .catch((e) => {
          this.smsCodeResult.loading = false
        })
    }
  }
}
</script>

<style scoped></style>
