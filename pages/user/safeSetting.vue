<template>
  <v-app>
    <v-layout column shrink>
      <v-layout>
        <v-card-title>
          安全设置
        </v-card-title>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="mt-5" justify-center>
      <v-flex sm7>
        <v-card class="pa-4">
          <v-layout justify-space-between>
            <v-form ref="form" class="pa-4" style="width: 100%">
              <v-layout align-center>
                <span>绑定邮箱：</span>
                <v-text-field
                  disabled
                  :value="userInfo.email"
                  hint=""
                  class="mt-3"
                ></v-text-field>
                <v-btn
                  class="ml-5"
                  text
                  small
                  outlined
                  @click="editEmail.dialog = true"
                  >修改</v-btn
                >
              </v-layout>
              <v-layout align-center>
                <span>绑定手机：</span>
                <v-text-field
                  disabled
                  :value="userInfo.phone"
                  hint=""
                  class="mt-3"
                ></v-text-field>
                <v-btn
                  class="ml-5"
                  text
                  small
                  outlined
                  @click="editPhone.dialog = true"
                  >修改</v-btn
                >
              </v-layout>
            </v-form>
            <v-spacer></v-spacer>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="editEmail.dialog" width="500px" persistent>
      <v-card>
        <v-card-text class="pb-0">
          <v-container class="pb-0">
            <v-form ref="emailForm">
              <v-layout align-center>
                <v-text-field
                  ref="editEmailRef"
                  v-model="editEmail.email"
                  label="输入要绑定的邮箱"
                  :rules="[rules.email]"
                >
                </v-text-field>
              </v-layout>

              <v-layout align-center>
                <v-text-field
                  v-model="editEmail.emailCode"
                  label="验证码"
                  :rules="[rules.requireCode]"
                >
                </v-text-field>
                <v-btn
                  v-show="emailCodeResult.timeInterval <= 0"
                  class="ml-5"
                  text
                  outlined
                  small
                  :loading="emailCodeResult.loading"
                  @click="sendEmailCode"
                  >获取验证码</v-btn
                >
                <v-btn
                  v-show="emailCodeResult.timeInterval > 0"
                  class="ml-5"
                  text
                  outlined
                  small
                  disabled
                  >{{ emailCodeResult.timeInterval }}&nbsp;s后重发</v-btn
                >
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="sub" text small @click="editEmail.dialog = false"
            >关闭</v-btn
          >
          <v-btn color="primary" outlined small text @click="updateEmail"
            >提交</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editPhone.dialog" width="500px" persistent>
      <v-card>
        <v-card-text class="pb-0">
          <v-container class="pb-0">
            <v-form ref="phoneForm">
              <v-layout align-center>
                <v-text-field
                  ref="editPhoneRef"
                  v-model="editPhone.phone"
                  label="输入要绑定的手机号码"
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
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="sub" text small @click="editPhone.dialog = false"
            >关闭</v-btn
          >
          <v-btn color="primary" outlined small text @click="updatePhone"
            >提交</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <InfoDialog
      :msg="['修改成功', saveEmailResult.errorMsg]"
      :succeed="saveEmailResult.resp != null && saveEmailResult.resp.succeed"
      :dialog="saveEmailResult.dialog"
      @update:dialog="saveEmailResult.dialog = $event"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['修改成功', savePhoneResult.errorMsg]"
      :succeed="savePhoneResult.resp != null && savePhoneResult.resp.succeed"
      :dialog="savePhoneResult.dialog"
      @update:dialog="savePhoneResult.dialog = $event"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['验证码发送成功，请至邮箱查看', '验证码发送失败, 请稍后重试']"
      :succeed="emailCodeResult.resp != null && emailCodeResult.resp.succeed"
      :dialog="emailCodeResult.dialog"
      @update:dialog="emailCodeResult.dialog = $event"
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
import InfoDialog from '../../components/InfoDialog'
export default {
  components: {
    InfoDialog
  },
  data: () => ({
    rules: {
      max100: (v) => !v || (v && v.length <= 100) || '最多100个字符',
      max16: (v) => !v || (v && v.length <= 16) || '最多16个字符',
      email: (v) => {
        if (!v) {
          return '请输入邮箱账号'
        }
        return (
          (v &&
            /^([A-Za-z0-9_\-.\u4E00-\u9FA5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/.test(
              v
            )) ||
          '请输入正确的邮箱账号'
        )
      },
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
    },
    saveEmailResult: {
      dialog: false,
      resp: null,
      loading: false,
      errorMsg: null
    },
    savePhoneResult: {
      dialog: false,
      resp: null,
      loading: false,
      errorMsg: null
    },
    userInfo: null,
    editEmail: {
      dialog: false,
      emailCode: null,
      email: null
    },
    editPhone: {
      dialog: false,
      phone: null,
      smsCode: null,
      phoneCheck: null
    },
    emailCodeResult: {
      dialog: false,
      resp: null,
      loading: false,
      timeInterval: 0
    },
    smsCodeResult: {
      dialog: false,
      resp: null,
      loading: false,
      timeInterval: 0
    }
  }),
  computed: {},
  created() {
    // 深层拷贝一个userInfo
    this.userInfo = this.$store.getters.getUserInfo
  },
  methods: {
    sendEmailCode() {
      if (!this.$refs.editEmailRef.validate()) {
        return false
      }
      if (this.emailCodeResult.timeInterval > 0) {
        this.emailCodeResult.showSendWarning = true
        return false
      }
      this.emailCodeResult.loading = true
      this.$axios
        .$post('/email/sendCode', {
          email: this.editEmail.email
        })
        .then((resp) => {
          this.emailCodeResult.resp = resp
          if (!resp.succeed) {
            this.emailCodeResult.dialog = true
          }
          this.emailCodeResult.loading = false
          const _self = this
          _self.emailCodeResult.timeInterval = 60
          const _interval = setInterval(function() {
            _self.emailCodeResult.timeInterval--
            if (_self.emailCodeResult.timeInterval <= 0) {
              clearInterval(_interval)
            }
          }, 1000)
        })
        .catch((e) => {
          this.emailCodeResult.loading = false
        })
    },
    sendSmsCode() {
      if (!this.$refs.editPhoneRef.validate()) {
        return false
      }
      this.$axios
        .$post('/userInfo/checkPhone', {
          phone: this.editPhone.phone
        })
        .then((resp) => {
          this.editPhone.phoneCheck = resp.data ? '' : '手机号码已被使用'
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
    updateEmail() {
      if (!this.$refs.emailForm.validate()) {
        return false
      }
      this.saveEmailResult.loading = true
      this.$axios
        .$post('/safeSetting/updateEmail', {
          newEmail: this.editEmail.email,
          emailCode: this.editEmail.emailCode.trim()
        })
        .then((resp) => {
          this.saveEmailResult.dialog = true
          this.saveEmailResult.resp = resp
          this.saveEmailResult.loading = false
          this.saveEmailResult.errorMsg = resp.msg
          if (resp.succeed) {
            this.$store.commit('setUserInfo', resp.data)
            this.userInfo.email = resp.data.email
            this.editEmail.dialog = false
          }
        })
        .catch((e) => {
          this.saveEmailResult.loading = false
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
            this.userInfo.phone = resp.data.phone
            this.editPhone.dialog = false
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
