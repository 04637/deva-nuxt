<template>
  <v-container justify-center align-start>
    <v-layout column>
      <v-card-title>注册</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center>
      <v-card class="pa-8 mt-6" width="520px">
        <logo type="form"></logo>
        <v-form ref="form">
          <v-layout class="mt-3" column>
            <v-text-field
              v-model="username"
              class="mt-4"
              hint="8-16位，字母开头"
              counter="16"
              label="用户名"
              outlined
              required
              :rules="[rules.username]"
              :error-messages="usernameCheck"
              @blur="checkUsername"
            ></v-text-field>
            <v-text-field
              v-model="email"
              class="mt-4"
              hint="****@example.com"
              label="邮箱"
              outlined
              required
              :rules="[rules.email]"
            ></v-text-field>
            <v-text-field
              v-model="phone"
              class="mt-4"
              hint="186****0106"
              label="手机号码"
              outlined
              required
              :error-messages="phoneCheck"
              :rules="[rules.phone]"
              @blur="checkPhone"
            ></v-text-field>
            <v-text-field
              v-model="password"
              class="mt-4"
              hint="8-16位，包含大小写及数字"
              counter="16"
              label="密码"
              outlined
              :append-icon="show ? 'visibility' : 'visibility_off'"
              :rules="[rules.password]"
              :type="show ? 'text' : 'password'"
              required
              @click:append="show = !show"
              @keyup.enter.native="submitSignUp"
            ></v-text-field>
            <v-layout justify-end class="mt-4">
              <v-btn
                outlined
                accent
                depressed
                min-width="150px"
                :loading="loading"
                @click="submitSignUp"
                >注册</v-btn
              >
            </v-layout>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
    <v-layout justify-center>
      <v-card class="pa-8 mt-6" width="520px">
        <v-layout justify-center>
          <v-btn text depressed to="login"
            >已有账号？<span style="color: orange">去登录</span></v-btn
          >
        </v-layout>
      </v-card>

      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            {{ dialogMessage }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false"
              >关闭</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import Logo from '../../components/Logo'
export default {
  components: {
    Logo
  },
  data: () => ({
    show: false,
    username: '',
    email: '',
    phone: '',
    password: '',
    usernameCheck: '',
    phoneCheck: '',
    dialog: false,
    dialogTitle: '',
    dialogMessage: '',
    loading: false,
    rules: {
      username(v) {
        if (!v) {
          return '用户名不能为空'
        } else if (!/^[A-z]+.*/.test(v)) {
          return '用户名需以字母开头'
        } else if (v.length < 8 || v.length > 16) {
          return '请输入8-16位用户名'
        } else {
          return true
        }
      },
      email(v) {
        if (!v) {
          return true
        } else if (
          !/^([A-Za-z0-9_\-.\u4E00-\u9FA5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/.test(
            v
          )
        ) {
          return '请输入正确的邮箱地址'
        } else {
          return true
        }
      },
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
    }
  }),
  watch: {},
  created() {},
  methods: {
    checkUsername() {
      this.$axios
        .$post('/userInfo/checkUsername', {
          username: this.username
        })
        .then((resp) => {
          this.usernameCheck = resp.data ? '' : '用户名已存在'
        })
    },
    checkPhone() {
      this.$axios
        .$post('/userInfo/checkPhone', {
          phone: this.phone
        })
        .then((resp) => {
          this.phoneCheck = resp.data ? '' : '手机号码已被使用'
        })
    },
    submitSignUp() {
      if (!this.$refs.form.validate()) {
        return false
      }
      if (this.usernameCheck || this.phoneCheck) {
        return false
      }
      this.loading = true
      const _this = this
      this.$axios
        .$post('/userInfo/signUp', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then((resp) => {
          _this.loading = false
          _this.dialogTitle = resp.succeed ? '注册成功' : '注册失败'
          _this.dialogMessage = resp.msg
          _this.dialog = true
        })
        .catch((e) => {
          _this.loading = false
          _this.dialogTitle = '注册失败'
          _this.dialogMessage = e.response.data[0].defaultMessage
          _this.dialog = true
        })
    }
  }
}
</script>

<style scoped></style>
