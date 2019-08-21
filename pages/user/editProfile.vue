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
                  <v-img :aspect-ratio="16 / 9" :src="photoSrc">
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
                <v-card-title>别叫我小海绵</v-card-title>
              </v-layout>
              <v-layout class="mt-2">
                <v-divider></v-divider>
              </v-layout>
              <v-layout justify-center>
                <v-card-text
                  >该用户太懒，什么也没留下该用户太懒，什么也没留下该用户太懒，什么也没留下</v-card-text
                >
              </v-layout>
              <v-layout justify-center>
                <v-icon class="mr-2">email</v-icon>
                04637@163.com
              </v-layout>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs5>
              <v-form class="form">
                <v-text-field
                  hint=""
                  :counter="16"
                  label="昵称"
                  outlined
                  class="mt-3"
                  :rules="[rules.required]"
                  name=""
                  value="别叫我小海绵"
                ></v-text-field>
                <v-textarea
                  hint=""
                  :counter="50"
                  label="简介"
                  outlined
                  required
                  no-resize
                  value="该用户太懒,什么也没留下"
                ></v-textarea>
                <v-text-field
                  hint=""
                  :counter="16"
                  label="邮箱"
                  outlined
                  class="mt-3"
                  :rules="[rules.required]"
                  name=""
                  value="04637@163.com"
                ></v-text-field>
                <v-text-field
                  hint=""
                  :counter="16"
                  label="登录密码"
                  outlined
                  class="mt-3"
                  :rules="[rules.required, rules.min]"
                  type="password"
                  name="input-10-1"
                  value="jiguantong"
                  required
                  @click:append="show = !show"
                ></v-text-field>
                <v-layout class="justify-end mt-3">
                  <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on }">
                      <v-btn dark v-on="on">保存</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">安全验证</span>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field
                          label="请输入当前登录密码"
                          :loading="validPasswordLoading"
                        ></v-text-field>
                        <!--<small></small>-->
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="dialog = false"
                          >关闭</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="validPasswordLoading = true"
                          >确定</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
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
      required: (value) => !!value || 'Required.',
      min: (v) => (v && v.length >= 8) || 'Min 8 characters'
    },
    photoSrc: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg'
  }),
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
