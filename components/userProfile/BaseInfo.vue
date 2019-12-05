<template>
  <div>
    <v-card flat>
      <v-layout justify-center>
        <v-form ref="form" class="pa-10" style="width: 87%;max-width: 600px;">
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
          <v-text-field
            v-model="userInfo.email"
            label="邮箱"
            outlined
            class="mt-3"
            disabled
          ></v-text-field>
          <v-text-field
            v-model="userInfo.phone"
            label="手机"
            outlined
            class="mt-3"
            disabled
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
              color="primary"
              min-width="150px"
              :loading="saveResult.loading"
              @click="saveProfile"
              >保存</v-btn
            >
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
  </div>
</template>

<script>
import InfoDialog from '../InfoDialog'
export default {
  name: 'BaseInfo',
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
      max16: (v) => !v || (v && v.length <= 16) || '最多16个字符'
    }
  }),
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
    }
  }
}
</script>

<style scoped></style>
