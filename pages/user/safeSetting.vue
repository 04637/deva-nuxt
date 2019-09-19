<template>
  <v-container justify-center align-start>
    <v-layout column>
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
                  outlined
                  @click="editEmail.dialog = true"
                  >修改</v-btn
                >
              </v-layout>
              <v-text-field
                v-if="showVerification"
                v-model="emailCode"
                label="验证码"
                :rules="[rules.requireCode]"
              >
              </v-text-field>
              <!--todo 改为弹窗形式的-->
              <v-layout align-center>
                <v-text-field
                  ref="phone"
                  v-model="userInfo.phone"
                  class="mt-4"
                  label="绑定手机号"
                  required
                  :error-messages="phoneCheck"
                  :rules="[rules.phone]"
                  @blur="checkPhone"
                ></v-text-field>
                <v-btn
                  v-show="
                    smsCodeResult.timeInterval <= 0 && showSmsVerification
                  "
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
              <v-text-field
                v-if="showSmsVerification"
                v-model="smsCode"
                label="验证码"
                :rules="[rules.requireCode]"
              >
              </v-text-field>
            </v-form>
            <v-spacer></v-spacer>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="editEmail.dialog" width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">修改绑定邮箱</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row align="center">
              <v-text-field label="绑定邮箱"> </v-text-field>
              <v-btn
                v-show="emailCodeResult.timeInterval <= 0"
                class="ml-5"
                text
                outlined
                :loading="emailCodeResult.loading"
                @click="sendEmailCode"
                >获取验证码</v-btn
              >
              <v-btn
                v-show="emailCodeResult.timeInterval > 0"
                class="ml-5"
                text
                outlined
                disabled
                >{{ emailCodeResult.timeInterval }}&nbsp;s后重发</v-btn
              >
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Close</v-btn
          >
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <InfoDialog
      :msg="['验证码发送成功，请至邮箱查看', '验证码发送失败, 请稍后重试']"
      :succeed="emailCodeResult.resp != null && emailCodeResult.resp.succeed"
      :dialog="emailCodeResult.dialog"
      @update:dialog="emailCodeResult.dialog = $event"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['保存成功', saveResult.errorMsg]"
      :succeed="saveResult.resp != null && saveResult.resp.succeed"
      :dialog="saveResult.dialog"
      @update:dialog="saveResult.dialog = $event"
    >
    </InfoDialog>
    <InfoDialog
      :msg="['修改成功', uploadResult.errorMsg]"
      :succeed="uploadResult.resp != null && uploadResult.resp.succeed"
      :dialog="uploadResult.dialog"
      @update:dialog="uploadResult.dialog = $event"
    >
    </InfoDialog>
  </v-container>
</template>
<script>
import InfoDialog from '../../components/InfoDialog'
export default {
  components: {
    InfoDialog
  },
  data: () => ({
    show: false,
    dialog: false,
    validPasswordLoading: false,
    rules: {
      max100: (v) => !v || (v && v.length <= 100) || '最多100个字符',
      max16: (v) => !v || (v && v.length <= 16) || '最多16个字符',
      email: (v) =>
        !v ||
        ((v &&
          /^([A-Za-z0-9_\-.\u4E00-\u9FA5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/.test(
            v
          )) ||
          '请输入正确的邮箱账号'),
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
    userInfo: null,
    emailCode: null,
    editEmail: {
      dialog: false,
      email: null
    },
    emailCodeResult: {
      dialog: false,
      resp: null,
      loading: false,
      timeInterval: 0,
      showSendWarning: false
    },
    smsCode: null,
    smsCodeResult: {
      dialog: false,
      resp: null,
      loading: false,
      timeInterval: 0,
      showSendWarning: false
    },
    saveResult: {
      dialog: false,
      resp: null,
      loading: false,
      errorMsg: null
    },
    uploadResult: {
      dialog: false,
      resp: null,
      errorMsg: null
    }
  }),
  computed: {
    showVerification() {
      return (
        this.userInfo &&
        this.userInfo.email.length > 0 &&
        this.userInfo.email !== this.$store.getters.getUserInfo.email
      )
    },
    showSmsVerification() {
      return (
        this.userInfo &&
        this.userInfo.phone.length > 0 &&
        this.userInfo.phone !== this.$store.getters.getUserInfo.phone
      )
    }
  },
  created() {
    // 深层拷贝一个userInfo
    this.userInfo = JSON.parse(JSON.stringify(this.$store.getters.getUserInfo))
  },
  methods: {
    uploadAvatar(e) {
      const _newAvatar = e.target.files[0]
      if (!_newAvatar) {
        return
      }
      if (_newAvatar.size > 5 * 1024 * 1024) {
        this.uploadResult.dialog = true
        this.uploadResult.errorMsg = '请选择5M以下的图片'
        this.uploadResult.resp = { succeed: false }
        return
      }
      const _formData = new FormData()
      _formData.append('newAvatar', _newAvatar)
      this.$axios
        .$post('/userInfo/updateUserAvatar', _formData)
        .then((resp) => {
          this.uploadResult.dialog = true
          this.uploadResult.resp = resp
          if (resp.succeed) {
            this.userInfo.avatar = resp.data
            this.$store.commit('setAvatar', resp.data)
          } else {
            this.uploadResult.errorMsg = resp.msg
          }
        })
    },
    sendEmailCode() {
      if (!this.$refs.newEmail.validate()) {
        return false
      }
      if (this.emailCodeResult.timeInterval > 0) {
        this.emailCodeResult.showSendWarning = true
        return false
      }
      this.emailCodeResult.loading = true
      this.$axios
        .$post('/email/sendEmailCode', {
          email: this.userInfo.email
        })
        .then((resp) => {
          this.emailCodeResult.resp = resp
          this.emailCodeResult.dialog = true
          this.emailCodeResult.loading = false
          const _self = this
          _self.emailCodeResult.timeInterval = 60
          const _interval = setInterval(function() {
            _self.emailCodeResult.timeInterval--
            if (_self.emailCodeResult.timeInterval <= 0) {
              clearInterval(_interval)
              _self.emailCodeResult.showSendWarning = false
            }
          }, 1000)
        })
        .catch((e) => {
          this.emailCodeResult.loading = false
        })
    },
    saveProfile() {
      if (!this.$refs.form.validate()) {
        return false
      } else {
        this.saveResult.loading = true

        this.$axios.setHeader('Content-Type', 'multipart/form-data')
        this.$axios
          .$post('/userInfo/updateUserInfo', {
            nickname: this.userInfo.nickname,
            email: this.userInfo.email,
            bio: this.userInfo.bio,
            newAvatar: this.avatarFile,
            emailCode: this.emailCode
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
    checkPhone() {
      if (!this.$refs.phone.validate()) {
        return false
      }
      this.$axios
        .$post('/userInfo/checkPhone', {
          phone: this.phone
        })
        .then((resp) => {
          this.phoneCheck = resp.data ? '' : '手机号码已被使用'
        })
    }
  }
}
</script>
<style scoped>
.lightbox {
  box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 48px
  );
}
</style>
