<template>
  <v-container justify-center align-start>
    <v-layout column>
      <v-layout>
        <v-card-title>
          档案编辑
        </v-card-title>
      </v-layout>
      <v-divider></v-divider>
    </v-layout>
    <v-layout class="mt-5" justify-center>
      <v-flex>
        <v-card class="pa-4">
          <v-layout justify-space-between>
            <v-flex align-center xs3 hidden-md-and-down>
              <v-layout justify-center>
                <v-avatar color="grey" size="200" tile right>
                  <v-img
                    :aspect-ratio="16 / 9"
                    :src="photoSrc || userInfo.avatar"
                  >
                    <v-layout
                      pa-2
                      column
                      fill-height
                      class="lightbox white--text"
                    >
                      <v-spacer></v-spacer>
                      <v-flex shrink>
                        <input
                          v-show="false"
                          ref="selectAvatar"
                          accept="image/png, image/jpeg, image/bmp"
                          type="file"
                          @change="previewImg($event)"
                        />
                        <v-btn
                          text
                          block
                          class="subheading font-weight-bold"
                          @click="$refs.selectAvatar.click()"
                          >重新上传头像
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
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs9 lg6>
              <v-form class="mt-0" style="width: 100%">
                <v-text-field
                  v-model="userInfo.nickname"
                  hint=""
                  :counter="16"
                  label="昵称"
                  outlined
                  class="mt-3"
                  :rules="[rules.max16]"
                  name=""
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
                <v-text-field
                  v-model="userInfo.email"
                  hint=""
                  label="邮箱"
                  outlined
                  class="mt-3"
                  name=""
                  :rules="[rules.email]"
                ></v-text-field>
                <v-layout class="justify-end mt-3">
                  <v-btn outlined min-width="150px">保存</v-btn>
                </v-layout>
              </v-form>
            </v-flex>
            <v-spacer></v-spacer>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
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
          '请输入正确的邮箱账号')
    },
    photoSrc: null,
    userInfo: null
  }),
  created() {
    // 深层拷贝一个userInfo
    this.userInfo = JSON.parse(JSON.stringify(this.$store.getters.getUserInfo))
  },
  methods: {
    previewImg(e) {
      const files = e.target.files[0]
      const that = this

      // 判断浏览器是否支持 FileReader
      if (!e || !window.FileReader) {
        alert('您的设备不支持图片预览功能，如需该功能请升级您的设备！')
        return
      }
      const reader = new FileReader()

      // 这里是最关键的一步，转换就在这里
      if (files) {
        reader.readAsDataURL(files)
      }

      reader.onload = function() {
        that.photoSrc = this.result
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
