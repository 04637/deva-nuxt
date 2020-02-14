<template>
  <v-app>
    <v-layout column shrink>
      <v-layout>
        <v-card-title>
          基本资料
        </v-card-title>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="mt-5" shrink>
      <v-layout align-center justify-space-around>
        <v-flex align-center md3 hidden-md-and-down>
          <v-card class="pa-6">
            <v-layout justify-center>
              <v-avatar color="grey" size="200" tile right>
                <v-img :aspect-ratio="16 / 9" :src="userInfo.avatar">
                  <template v-slot:placeholder>
                    <v-layout justify-center align-center fill-height>
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-layout>
                  </template>
                  <v-layout
                    pa-2
                    column
                    fill-height
                    class="lightbox white--text"
                  >
                    <v-spacer></v-spacer>
                    <v-flex shrink>
                      <input
                        ref="selectAvatar"
                        v-show="false"
                        @change="uploadAvatar($event)"
                        accept="image/png, image/jpeg, image/bmp"
                        type="file"
                      />
                      <v-btn
                        @click="$refs.selectAvatar.click()"
                        text
                        block
                        class="white--text subheading"
                        >修改头像
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-img>
              </v-avatar>
            </v-layout>
            <v-layout class="mt-2" justify-center>
              <v-card-title>{{
                userInfo.nickname || userInfo.username
              }}</v-card-title>
            </v-layout>
            <v-layout class="mt-2">
              <v-divider></v-divider>
            </v-layout>
            <v-layout justify-center>
              <v-card-text>{{ userInfo.bio }}</v-card-text>
            </v-layout>
            <v-layout v-show="userInfo.email" justify-center>
              <v-icon class="mr-2">email</v-icon>
              {{ userInfo.email }}
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs12 md9 lg6>
          <v-card class="pa-6">
            <v-form ref="form" class="mt-0" style="width: 100%">
              <v-text-field
                v-model="userInfo.username"
                label="用户名"
                outlined
                class="mt-3"
                disabled
              ></v-text-field>
              <v-text-field
                v-model="userInfo.nickname"
                :counter="16"
                :rules="[rules.max16]"
                :error-messages="nicknameCheck"
                @blur="checkNickname"
                hint=""
                label="昵称"
                outlined
                class="mt-3"
              ></v-text-field>
              <v-textarea
                v-model="userInfo.bio"
                :counter="100"
                :rules="[rules.max100]"
                hint=""
                label="简介"
                outlined
                no-resize
              ></v-textarea>
              <v-layout class="justify-end mt-3">
                <v-btn
                  :loading="saveResult.loading"
                  @click="saveProfile"
                  color="primary"
                  min-width="150px"
                  >保存</v-btn
                >
              </v-layout>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
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
  </v-app>
</template>
<script>
import InfoDialog from '../../components/dialog/InfoDialog'
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
      max16: (v) => !v || (v && v.length <= 16) || '最多16个字符'
    },
    nicknameCheck: '',
    userInfo: null,
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
  computed: {},
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
          this.uploadResult.resp = resp
          if (resp.succeed) {
            this.userInfo.avatar = resp.data
            this.$store.commit('setAvatar', resp.data)
          } else {
            this.uploadResult.errorMsg = resp.msg
            this.uploadResult.dialog = true
          }
        })
    },
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
            bio: this.userInfo.bio,
            newAvatar: this.avatarFile
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
