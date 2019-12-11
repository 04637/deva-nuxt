<template>
  <v-app>
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
                small
                text
                depressed
                color="link_color"
                @click="usernameLogin = false"
                >短信验证码登录</v-btn
              >
              <v-btn
                color="my_green"
                class="white--text"
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
                text
                small
                depressed
                color="link_color"
                @click="usernameLogin = true"
                >用户名密码登录</v-btn
              >
              <v-btn
                color="my_green"
                class="white--text"
                accent
                depressed
                min-width="150px"
                :loading="loading"
                @click="submitLogin"
                >登录</v-btn
              >
            </v-layout>
          </v-layout>
          <third-login class="mt-1 pl-1"></third-login>
          <v-layout
            align-start
            justify-center
            class="mt-2"
            style="font-size: 13px"
          >
            <span class="my_gray--text">登录即代表您已阅读并同意</span>
            <a @click="termsDialog = true">
              <span class="warning--text">《法律声明和隐私权政策》</span>
            </a>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
    <v-layout justify-center shrink>
      <v-card class="pa-8 mt-6" width="520px">
        <v-layout justify-center>
          <v-btn text depressed to="signUp"
            >还没有账号？<span class="private--text">去注册</span></v-btn
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
    <TermsDialog
      :dialog="termsDialog"
      @update:dialog="termsDialog = $event"
    ></TermsDialog>
  </v-app>
</template>
<script>
import Logo from '../../components/Logo'
import InfoDialog from '../../components/dialog/InfoDialog'
import TermsDialog from '../../components/dialog/TermsDialog'
import ThirdLogin from '../../components/login/ThirdLogin'
export default {
  components: {
    ThirdLogin,
    TermsDialog,
    Logo,
    InfoDialog
  },
  data: () => ({
    termsDialog: false,
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
    usernameLogin: true
  }),
  mounted() {
    this.threeWayLogin()
  },
  created() {},
  middleware: 'notAuthenticated',
  methods: {
    threeWayLogin() {
      if (this.$route.query.code) {
        this.loading = true
        this.$axios
          .$post('/userInfo/thirdLogin', {
            code: this.$route.query.code,
            plat: this.$route.query.auth || 'qq'
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
