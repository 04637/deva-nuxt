<template>
  <v-dialog :value="$store.getters.getPhoneDialog" width="500px" persistent>
    <v-card>
      <v-card-text class="pb-0">
        <v-container class="pb-0">
          <v-form ref="phoneForm">
            <v-layout align-center>
              <v-text-field
                ref="editPhoneRef"
                v-model="editPhone.phone"
                label="手机号"
                :error-messages="editPhone.phoneCheck"
                :rules="[rules.phone]"
              >
              </v-text-field>
            </v-layout>

            <v-layout align-center>
              <v-text-field
                v-model="editPhone.smsCode"
                label="验证码"
                :rules="[rules.requireCode]"
              >
              </v-text-field>
              <v-btn
                v-show="smsCodeResult.timeInterval <= 0"
                text
                color="link_color"
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
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          color="sub"
          text
          small
          @click="$store.commit('setPhoneDialog', false)"
          >关闭</v-btn
        >
        <v-btn color="primary" small text @click="updatePhone"
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
