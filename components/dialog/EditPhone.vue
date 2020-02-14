<template>
  <v-dialog :value="$store.getters.getPhoneDialog" width="400px" persistent>
    <v-card>
      <v-flex>
        <v-layout justify-center wrap>
          <v-card-title>设置手机号</v-card-title>
        </v-layout>
        <v-layout style="font-size: 13px; color: #666;" justify-center>
          绑定手机后, 你就可以使用提问、回答、评论等功能。
        </v-layout>
      </v-flex>
      <v-card-text class="pb-0">
        <v-container class="pb-0">
          <v-form ref="phoneForm">
            <v-layout align-center>
              <v-text-field
                ref="editPhoneRef"
                v-model="editPhone.phone"
                :error-messages="editPhone.phoneCheck"
                :rules="[rules.phone]"
                label="手机号"
              >
              </v-text-field>
            </v-layout>

            <v-layout align-center>
              <v-text-field
                v-model="editPhone.smsCode"
                :rules="[rules.requireCode]"
                label="验证码"
              >
              </v-text-field>
              <v-btn
                v-show="smsCodeResult.timeInterval <= 0"
                :loading="smsCodeResult.loading"
                @click="sendSmsCode"
                text
                color="link_color"
                small
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
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          @click="$store.commit('setPhoneDialog', false)"
          color="sub"
          text
          small
          >关闭</v-btn
        >
        <v-btn @click="updatePhone" color="primary" small text
          ><span>提交</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EditPhone',
  data: () => ({
    smsCodeResult: {
      dialog: false,
      resp: null,
      loading: false,
      timeInterval: 0
    },
    editPhone: {
      phone: null,
      smsCode: null,
      phoneCheck: null
    },
    savePhoneResult: {
      dialog: false,
      resp: null,
      loading: false,
      errorMsg: null
    },
    rules: {
      requireCode: (v) => (v && v.length > 0) || '请输入验证码',
      phone(v) {
        if (!v) {
          return '手机号不能为空'
        } else if (!/^1[3456789]\d{9}$/.test(v)) {
          return '请输入正确的手机号码'
        } else {
          return true
        }
      }
    }
  }),
  methods: {
    sendSmsCode() {
      if (!this.$refs.editPhoneRef.validate()) {
        return false
      }
      this.$axios
        .$post('/userInfo/checkPhone', {
          phone: this.editPhone.phone
        })
        .then((resp) => {
          this.editPhone.phoneCheck = resp.data
            ? ''
            : '该手机号码已绑定DEVA帐号，您可以使用短信验证码登录该账号'
          // 如果未被使用, 则发送验证码
          if (resp.data) {
            if (this.smsCodeResult.timeInterval > 0) {
              this.smsCodeResult.showSendWarning = true
              return false
            }
            this.smsCodeResult.loading = true
            this.$axios
              .$post('/sms/sendCode', {
                phone: this.editPhone.phone
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
        })
    },
    updatePhone() {
      if (!this.$refs.phoneForm.validate()) {
        return false
      }
      this.savePhoneResult.loading = true
      this.$axios
        .$post('/safeSetting/updatePhone', {
          newPhone: this.editPhone.phone,
          smsCode: this.editPhone.smsCode.trim()
        })
        .then((resp) => {
          this.savePhoneResult.dialog = true
          this.savePhoneResult.resp = resp
          this.savePhoneResult.loading = false
          this.savePhoneResult.errorMsg = resp.msg
          if (resp.succeed) {
            this.$store.commit('setUserInfo', resp.data)
            this.$store.commit('setPhoneDialog', false)
          }
        })
        .catch((e) => {
          this.savePhoneResult.loading = false
        })
    }
  }
}
</script>

<style scoped></style>
