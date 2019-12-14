<template>
  <div>
    <v-card flat>
      <v-layout justify-center>
        <v-form
          ref="form"
          class="pa-lg-10 pa-md-3"
          style="max-width: 600px; width: 100%"
        >
          <v-text-field
            v-model="userInfo.username"
            label="用户名"
            outlined
            class="mt-3"
            disabled
          ></v-text-field>
          <v-text-field
            v-model="userInfo.nickname"
            hint=""
            :counter="16"
            label="昵称"
            outlined
            class="mt-3"
            :rules="[rules.max16]"
            :error-messages="nicknameCheck"
            @blur="checkNickname"
          ></v-text-field>
          <v-textarea
            v-model="userInfo.bio"
            hint=""
            :counter="100"
            label="简介"
            outlined
            no-resize
            :rules="[rules.max100]"
          ></v-textarea>
          <v-layout class="justify-end mt-3">
            <v-btn
              color="my_green"
              class="white--text"
              min-width="150px"
              :loading="saveResult.loading"
              @click="saveProfile"
              >保存</v-btn
            >
          </v-layout>
          <v-layout justify-space-between class="mt-5">
            <v-form ref="form" style="width: 100%">
              <v-layout align-center>
                <span>绑定邮箱：</span>
                <v-text-field
                  readonly
                  solo
                  :value="userInfo.email"
                  hide-details
                  class="center-text min-input"
                  append-icon="mdi-pencil"
                  @click:append="editEmail.dialog = true"
                ></v-text-field>
                <v-checkbox
                  v-model="userSetting.emailNotice"
                  color="private"
                  class="ml-5 mb-0 hidden-sm-and-down"
                  label="接收邮件消息推送"
                  @change="toggleEmailNotice"
                ></v-checkbox>
              </v-layout>
              <v-layout align-center>
                <span>绑定手机：</span>
                <v-text-field
                  readonly
                  :value="userInfo.phone"
                  hide-details
                  solo
                  class="center-text min-input"
                  append-icon="mdi-pencil"
                  @click:append="editPhone.dialog = true"
                ></v-text-field>
                <v-checkbox
                  v-model="userSetting.phoneNotice"
                  color="private"
                  class="ml-5 mb-0 hidden-sm-and-down"
                  label="接收敏感操作提示"
                  @change="togglePhoneNotice"
                ></v-checkbox>
              </v-layout>
              <v-layout align-center class="mt-3">
                <span>上次登录：<v-icon>mdi-gesture-double-tap</v-icon></span>
                <v-text-field
                  readonly
                  hide-details
                  :value="$store.getters.getUserInfo.lastLoginIp"
                  class="center-text mt-0 pt-0 no-padding-input"
                ></v-text-field>
              </v-layout>
              <v-layout justify-space-between align-center class="mt-2">
                <small v-show="!userInfo.phone" class="warning--text mr-4"
                  >修改密码需获取手机验证码，请绑定您的手机号码</small
                >
                <v-layout justify-end align-center>
                  <span class="my_gray--text" style="font-size: 13px"
                    >异常登录?
                  </span>

                  <v-btn
                    :disabled="!userInfo.phone"
                    color="private"
                    text
                    @click="editPassword.dialog = true"
                    ><span>点此修改密码</span></v-btn
                  ></v-layout
                >
              </v-layout>
            </v-form>
            <v-spacer></v-spacer>
          </v-layout>
        </v-form>
      </v-layout>
    </v-card>
    <InfoDialog
      :msg="['保存成功', saveResult.errorMsg]"
      :succeed="saveResult.resp != null && saveResult.resp.succeed"
      :dialog="saveResult.dialog"
      @update:dialog="saveResult.dialog = $event"
    >
    </InfoDialog>
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
                  text
                  color="link_color"
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
          <v-btn color="primary" small text @click="updateEmail">提交</v-btn>
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
          <v-btn color="sub" text small @click="editPhone.dialog = false"
            >关闭</v-btn
          >
          <v-btn color="primary" small text @click="updatePhone"
            ><span>提交</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--密码修改弹框-->
    <v-dialog v-model="editPassword.dialog" width="500px" persistent>
      <v-card>
        <v-card-text class="pb-0">
          <v-container class="pb-0">
            <v-form ref="passwordForm">
              <v-layout align-center>
                <v-text-field
                  ref="editPhoneRef"
                  v-model="editPassword.newPassword"
                  :append-icon="
                    editPassword.show ? 'visibility' : 'visibility_off'
                  "
                  :rules="[rules.password]"
                  :type="editPassword.show ? 'text' : 'password'"
                  required
                  label="输入新密码"
                  @click:append="editPassword.show = !editPassword.show"
                >
                </v-text-field>
              </v-layout>

              <v-layout align-center>
                <v-text-field
                  v-model="editPassword.smsCode"
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
                  @click="sendPasswordSmsCode"
                  >获取短信验证码</v-btn
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
          <v-btn color="sub" text small @click="editPassword.dialog = false"
            >关闭</v-btn
          >
          <v-btn color="primary" small text @click="updatePassword">提交</v-btn>
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
      :msg="['密码修改成功, 请使用新密码重新登录', savePasswordResult.errorMsg]"
      :succeed="
        savePasswordResult.resp != null && savePasswordResult.resp.succeed
      "
      :dialog="savePasswordResult.dialog"
      close-txt="去登录"
      @update:dialog="
        savePasswordResult.dialog = $event
        savePasswordResult.resp.succeed ? $router.push('/user/login') : ''
      "
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
  </div>
</template>

<script>
import InfoDialog from '../dialog/InfoDialog'
export default {
  components: { InfoDialog },
  props: {
    userInfo: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    nicknameCheck: '',
    saveResult: {
      dialog: false,
      resp: null,
      loading: false,
      errorMsg: null
    },
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
      },
      password(v) {
        if (!v) {
          return '密码不能为空'
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,20}$/.test(v)) {
          return '至少包含1个大写字母，1个小写字母和1个数字，8-16位'
        } else {
          return true
        }
      }
    },
    userSetting: {
      phoneNotice: false,
      emailNotice: false
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
    savePasswordResult: {
      dialog: false,
      resp: null,
      loading: false,
      errorMsg: null
    },
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
    editPassword: {
      dialog: false,
      newPassword: null,
      smsCode: null,
      show: false
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
  created() {
    this.loadUserSetting()
  },
  methods: {
    checkNickname() {
      if (
        !this.userInfo.nickname ||
        this.userInfo.nickname === this.$store.getters.getUserInfo.nickname
      ) {
        this.nicknameCheck = ''
        return false
      }
      this.$axios
        .$post('/userInfo/checkNickname', {
          nickname: this.userInfo.nickname
        })
        .then((resp) => {
          this.nicknameCheck = resp.data ? '' : '昵称已被使用'
        })
    },
    saveProfile() {
      if (!this.$refs.form.validate() || this.nicknameCheck) {
        return false
      } else {
        this.saveResult.loading = true

        this.$axios.setHeader('Content-Type', 'multipart/form-data')
        this.$axios
          .$post('/userInfo/updateUserInfo', {
            nickname: this.userInfo.nickname,
            bio: this.userInfo.bio
          })
          .then((resp) => {
            this.saveResult.loading = false
            this.saveResult.dialog = true
            this.saveResult.errorMsg = resp.msg
            this.saveResult.resp = resp
            if (resp.succeed) {
              this.$store.commit('setUserInfo', resp.data)
            }
          })
          .catch((e) => {
            this.saveResult.loading = false
          })
      }
    },
    loadUserSetting() {
      this.$axios
        .$post('/userSetting/getSetting', {
          userId: this.userInfo.userId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userSetting = resp.data
          }
        })
    },
    toggleEmailNotice() {
      this.$axios
        .$post('/userSetting/updateEmailNotice', {
          val: this.userSetting.emailNotice
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userSetting.emailNotice = resp.data
          } else {
            this.userSetting.emailNotice = !resp.data
          }
        })
    },
    togglePhoneNotice() {
      this.$axios
        .$post('/userSetting/updatePhoneNotice', {
          val: this.userSetting.phoneNotice
        })
        .then((resp) => {
          if (resp.succeed) {
            this.userSetting.phoneNotice = resp.data
          } else {
            this.userSetting.phoneNotice = !resp.data
          }
        })
    },
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
    },
    updatePassword() {
      if (!this.$refs.passwordForm.validate()) {
        return false
      }
      this.savePasswordResult.loading = true
      this.$axios
        .$post('/safeSetting/updatePassword', {
          newPassword: this.editPassword.newPassword,
          smsCode: this.editPassword.smsCode.trim()
        })
        .then((resp) => {
          this.savePasswordResult.dialog = true
          this.savePasswordResult.resp = resp
          this.savePasswordResult.loading = false
          this.savePasswordResult.errorMsg = resp.msg
          if (resp.succeed) {
            this.editPassword.dialog = false
            this.$store.commit('setUserInfo', null)
          }
        })
        .catch((e) => {
          this.savePasswordResult.loading = false
        })
    },
    sendPasswordSmsCode() {
      if (this.smsCodeResult.timeInterval > 0) {
        this.smsCodeResult.showSendWarning = true
        return false
      }
      this.smsCodeResult.loading = true
      this.$axios
        .$post('/sms/sendCode', {
          phone: this.userInfo.phone
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

<style>
.center-text input {
  text-indent: 10px;
}
.toBottom4 input {
  padding: 0;
  position: relative;
  top: 4px;
}
.no-padding-input input {
  padding-bottom: 0 !important;
}
</style>
<style scoped>
.mdi {
  font-size: 16px !important;
  position: relative;
  top: -2px;
}
</style>
