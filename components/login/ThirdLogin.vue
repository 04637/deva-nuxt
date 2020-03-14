<template>
  <v-layout align-center shrink>
    <a
      :href="loginUrl.wechat"
      style="text-decoration: none"
      title="使用 微信 帐号登录"
      ><v-btn icon small
        ><v-icon small color="#6fae56">mdi-wechat</v-icon></v-btn
      ></a
    >
    <a
      :href="loginUrl.github"
      style="text-decoration: none"
      title="使用 github 帐号登录"
      ><v-btn icon small
        ><v-icon small color="black">mdi-github</v-icon></v-btn
      ></a
    >
    <a
      :href="loginUrl.stackOverflow"
      style="text-decoration: none"
      title="使用 stackoverflow 帐号登录"
      ><v-btn icon small
        ><v-icon small color="#f48024">mdi-stack-overflow</v-icon></v-btn
      ></a
    >

    <a
      :href="loginUrl.qq"
      style="text-decoration: none"
      title="使用 QQ 帐号登录"
      ><v-btn icon small><v-icon small>mdi-qqchat</v-icon></v-btn></a
    >
    <a
      :href="loginUrl.gitlab"
      style="text-decoration: none"
      title="使用 gitlab 帐号登录"
      ><v-btn icon small
        ><v-icon small color="#e24329">mdi-gitlab</v-icon></v-btn
      ></a
    >
    <!--<a-->
    <!--  :href="loginUrl.google"-->
    <!--  style="text-decoration: none"-->
    <!--  title="使用 google 帐号登录"-->
    <!--  ><v-btn icon><v-icon>mdi-google</v-icon></v-btn></a-->
    <!--&gt;-->
  </v-layout>
</template>

<script>
import config from '../../nuxt.config.js'
export default {
  name: 'ThirdLogin',
  data: () => ({
    loginUrl: {
      github: config.githubLoginUrl,
      gitlab: config.gitlabLoginUrl,
      stackOverflow: config.stackOverflowLoginUrl,
      google: config.googleLoginUrl,
      qq: config.qqLoginUrl,
      wechat: config.wechatLoginUrl
    }
  })
}
</script>

<style scoped></style>
