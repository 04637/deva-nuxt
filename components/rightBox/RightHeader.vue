<template>
  <div class="pa-4 right-box">
    <div v-if="$store.getters.getUserId">
      <!--<v-layout justify-space-between class="mb-2">-->
      <!--  <v-btn-->
      <!--    to="/question/ask"-->
      <!--    color="my_green"-->
      <!--    class="white&#45;&#45;text"-->
      <!--    small-->
      <!--    width="45%"-->
      <!--    ><v-icon small>mdi-forum</v-icon>&nbsp;提问题</v-btn-->
      <!--  >-->
      <!--  <v-btn-->
      <!--    to="/blog/postBlog"-->
      <!--    color="blue"-->
      <!--    class="white&#45;&#45;text"-->
      <!--    small-->
      <!--    width="45%"-->
      <!--    ><v-icon small>mdi-file-document</v-icon>&nbsp;写文章</v-btn-->
      <!--  >-->
      <!--</v-layout>-->
      <v-layout align-center
        ><span
          class="my_gray--text d-block"
          style="border-left: 5px solid #ff6600; padding-left: 10px"
          >我的问题</span
        ></v-layout
      >
      <v-divider class="mt-2"></v-divider>
      <div v-if="myQuestions && myQuestions.length > 0" class="py-1 px-2 mt-2">
        <transition-group name="list">
          <div v-for="post in myQuestions" :key="post.questionId" class="mb-4">
            <v-layout align-center
              ><router-link
                style="font-size: 14px;"
                class="d-block text-truncate hover-line"
                :to="'/question/' + post.questionId"
                ><span style="font-weight:bold;" class="my_gray--text"
                  >·&nbsp;</span
                >{{ post.title }}</router-link
              ></v-layout
            >
          </div>
        </transition-group>
      </div>
      <v-layout justify-center class="mt-2">
        <v-btn
          outlined
          color="my_gray"
          width="100%"
          :to="'/user/' + $store.getters.getUserId + '?tab=ask'"
          >我的所有提问 >
        </v-btn>
      </v-layout>
    </div>
    <div v-else>
      <v-layout align-center
        ><span class="my_gray--text d-block" style="font-size: 13px"
          >立即登录</span
        ></v-layout
      >
      <v-divider class="mt-2"></v-divider>
      <v-text-field
        v-model="username"
        placeholder="用户名"
        solo
        class="min-input mt-2"
        hide-details
      >
      </v-text-field>
      <v-text-field
        v-model="password"
        placeholder="密码"
        type="password"
        solo
        class="min-input mt-2"
        hide-details
        @keyup.enter.native="submitLogin"
      >
      </v-text-field>
      <small class="red--text">{{ loginError }}</small>
      <v-layout justify-space-between class="mt-2" align-center
        ><v-btn to="/user/signUp" text small color="link_color">去注册</v-btn
        ><v-btn
          small
          text
          :loading="loginLoading"
          color="link_color"
          style="background-color: #338ece12"
          @click="submitLogin"
          >登录</v-btn
        ></v-layout
      >
      <third-login class="mt-2"></third-login>
    </div>
  </div>
</template>

<script>
import ThirdLogin from '../login/ThirdLogin'
export default {
  components: { ThirdLogin },
  data: () => ({
    myQuestions: null,
    username: '',
    password: '',
    loginLoading: false,
    loginError: ''
  }),
  created() {
    this.loadQuestions()
  },
  methods: {
    loadQuestions() {
      if (this.$store.getters.getUserId) {
        this.$axios
          .$post('/questionInfo/listMyQuestions', {
            size: 10
          })
          .then((resp) => {
            this.myQuestions = resp.data
          })
      }
    },
    submitLogin() {
      if (this.username.length < 1 || this.password < 1) {
        return false
      }
      this.loginLoading = true
      this.$axios
        .$post('/userInfo/login', {
          username: this.username,
          password: this.password
        })
        .then((resp) => {
          this.loginLoading = false
          if (resp.succeed) {
            this.$store.commit('setUserInfo', resp.data)
            this.loadQuestions()
          } else {
            this.loginError = '用户名或密码错误'
          }
        })
        .catch((e) => {
          this.loginLoading = false
        })
    }
  }
}
</script>

<style scoped></style>
