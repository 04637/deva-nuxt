<template>
  <v-app>
    <v-layout column shrink>
      <v-card-title>注册</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center shrink>
      <v-card class="pa-8 mt-6" width="520px">
        <logo type="form"></logo>
        <v-form ref="form">
          <v-layout class="mt-3" column>
            <v-text-field
              v-model="username"
              class="mt-4"
              hint="8-16位，字母开头"
              counter="16"
              label="用户名"
              outlined
              required
              :rules="[rules.username]"
              :error-messages="usernameCheck"
              @blur="checkUsername"
            ></v-text-field>
            <!--<v-text-field-->
            <!--  v-model="email"-->
            <!--  class="mt-4"-->
            <!--  hint="****@example.com"-->
            <!--  label="邮箱"-->
            <!--  outlined-->
            <!--  required-->
            <!--  :rules="[rules.email]"-->
            <!--&gt;</v-text-field>-->
            <v-text-field
              v-model="password"
              class="mt-4"
              hint="8-16位，包含大小写及数字"
              counter="16"
              label="密码"
              outlined
              :append-icon="show ? 'visibility' : 'visibility_off'"
              :rules="[rules.password]"
              :type="show ? 'text' : 'password'"
              required
              @click:append="show = !show"
              @keyup.enter.native="submitSignUp"
            ></v-text-field>
            <v-layout align-center>
              <v-text-field
                ref="phone"
                v-model="phone"
                class="mt-2"
                label="绑定手机号"
                required
                :error-messages="phoneCheck"
                :rules="[rules.phone]"
              ></v-text-field>
            </v-layout>
            <v-layout align-center>
              <v-text-field
                v-model="smsCode"
                label="验证码"
                :rules="[rules.requireCode]"
              >
              </v-text-field>
              <v-btn
                v-show="smsCodeResult.timeInterval <= 0"
                class="ml-5"
                text
                outlined
                :loading="smsCodeResult.loading"
                @click="sendSmsCode"
                >获取验证码</v-btn
              >
              <v-btn
                v-show="smsCodeResult.timeInterval > 0"
                class="ml-5"
                text
                outlined
                disabled
                >{{ smsCodeResult.timeInterval }}&nbsp;s后重发</v-btn
              >
            </v-layout>
            <v-layout justify-space-between class="mt-4" align-center>
              <v-layout align-center>
                <v-checkbox
                  v-model="termsCheck"
                  color="primary"
                  label="注册即代表同意"
                  :rules="[rules.agreeTerms]"
                ></v-checkbox>
                <v-btn
                  small
                  text
                  color="private"
                  style="margin-top: -6px"
                  @click="termsDialog = true"
                >
                  <strong>法律声明和隐私权政策</strong>
                </v-btn>
              </v-layout>
            </v-layout>
            <v-layout>
              <v-btn
                accent
                depressed
                width="100vw"
                color="primary"
                class="mt-4"
                :loading="signUpResult.loading"
                @click="submitSignUp"
                >注册</v-btn
              >
            </v-layout>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
    <v-layout justify-center shrink>
      <v-card class="pa-8 mt-6" width="520px">
        <v-layout justify-center>
          <v-btn text depressed to="login"
            >已有账号？<span style="color: orange">去登录</span></v-btn
          >
        </v-layout>
      </v-card>
    </v-layout>
    <InfoDialog
      :msg="['验证码发送成功', '操作频繁, 验证码发送失败, 请稍后重试']"
      :succeed="smsCodeResult.resp != null && smsCodeResult.resp.succeed"
      :dialog="smsCodeResult.dialog"
      @update:dialog="smsCodeResult.dialog = $event"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['注册成功', signUpResult.resp && signUpResult.resp.msg]"
      :succeed="signUpResult.resp != null && signUpResult.resp.succeed"
      :dialog="signUpResult.dialog"
      @update:dialog="signUpResult.dialog = $event"
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
import InfoDialog from '../../components/InfoDialog'
import TermsDialog from '../../components/TermsDialog'
export default {
  components: {
    TermsDialog,
    Logo,
    InfoDialog
  },
  data: () => ({
    show: false,
    username: '',
    email: '',
    phone: '',
    password: '',
    usernameCheck: '',
    phoneCheck: '',
    smsCode: null,
    smsCodeResult: {
      dialog: false,
      resp: null,
      loading: false,
      timeInterval: 0,
      showSendWarning: false
    },
    signUpResult: {
      dialog: false,
      resp: null,
      loading: false
    },
    termsCheck: false,
    termsDialog: false,
    rules: {
      username(v) {
        if (!v) {
          return '用户名不能为空'
        } else if (!/^[A-z]+.*/.test(v)) {
          return '用户名需以字母开头'
        } else if (v.length < 8 || v.length > 16) {
          return '请输入8-16位用户名'
        } else {
          return true
        }
      },
      email(v) {
        if (!v) {
          return true
        } else if (
          !/^([A-Za-z0-9_\-.\u4E00-\u9FA5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/.test(
            v
          )
        ) {
          return '请输入正确的邮箱地址'
        } else {
          return true
        }
      },
      phone(v) {
        if (!v) {
          return '手机号不能为空'
        } else if (!/^1[3456789]\d{9}$/.test(v)) {
          return '请输入正确的手机号码'
        } else {
          return true
        }
      },
      password(v) {
        if (!v) {
          return '密码不能为空'
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,20}$/.test(v)) {
          return '至少包含1个大写字母，1个小写字母和1个数字，8-16位'
        } else {
          return true
        }
      },
      requireCode: (v) => (v && v.length > 0) || '请输入验证码',
      agreeTerms: (v) => (v && v === true) || '阅读并同意相关条款后方可进行注册'
    }
  }),
  watch: {},
  created() {},
  methods: {
    checkUsername() {
      this.$axios
        .$post('/userInfo/checkUsername', {
          username: this.username
        })
        .then((resp) => {
          this.usernameCheck = resp.data ? '' : '用户名已存在'
        })
    },
    sendSmsCode() {
      if (!this.$refs.phone.validate()) {
        return false
      }
      this.$axios
        .$post('/userInfo/checkPhone', {
          phone: this.phone
        })
        .then((resp) => {
          this.phoneCheck = resp.data ? '' : '手机号码已被使用'
          if (resp.succeed) {
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
                this.smsCodeResult.dialog = true
                this.smsCodeResult.loading = false
                const _self = this
                _self.smsCodeResult.timeInterval = 60
                const _interval = setInterval(function() {
                  _self.smsCodeResult.timeInterval--
                  if (_self.smsCodeResult.timeInterval <= 0) {
                    clearInterval(_interval)
                    _self.smsCodeResult.showSendWarning = false
                  }
                }, 1000)
              })
              .catch((e) => {
                this.smsCodeResult.loading = false
              })
          }
        })
    },
    submitSignUp() {
      if (!this.$refs.form.validate()) {
        return false
      }
      if (this.usernameCheck || this.phoneCheck) {
        return false
      }
      this.signUpResult.loading = true
      this.$axios
        .$post('/userInfo/signUp', {
          username: this.username,
          password: this.password,
          phone: this.phone,
          smsCode: this.smsCode.trim()
        })
        .then((resp) => {
          this.signUpResult.loading = false
          this.signUpResult.dialog = true
          this.signUpResult.resp = resp
        })
        .catch((e) => {
          this.signUpResult.loading = false
          this.signUpResult.dialog = true
        })
    }
  }
}
</script>

<style scoped></style>
