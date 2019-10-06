<template>
  <no-ssr>
    <div>
      <v-speed-dial
        v-model="fab"
        bottom
        right
        fixed
        direction="left"
        open-on-hover
        transition="slide-x-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="primary" fab>
            <v-icon v-if="fab" title="回到顶部" @click="toTop"
              >vertical_align_top</v-icon
            >
            <v-icon v-else>scatter_plot</v-icon>
          </v-btn>
        </template>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn fab dark small color="blue" v-on="on">
              <v-icon>mdi-email</v-icon>
            </v-btn>
          </template>
          <span>联系我们：admin@aid.dev</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <a
              style="text-decoration: none"
              href="https://jq.qq.com/?_wv=1027&k=5rD73Wh"
              target="_blank"
              ><v-btn fab dark small color="green" v-on="on">
                <v-icon>mdi-help</v-icon>
              </v-btn></a
            >
          </template>
          <span>如果您需要帮助，点击加入我们的官方QQ群：930562002</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              dark
              small
              color="orange"
              @click="suggest.dialog = true"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>建议反馈</span>
        </v-tooltip>
      </v-speed-dial>
      <v-dialog v-model="suggest.dialog" persistent max-width="40vw">
        <v-card>
          <v-card-title>
            <span class="headline">建议反馈</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="suggestForm">
              <v-textarea
                v-model="suggest.content"
                label="输入您的意见"
                :rules="[rules.min10, rules.max1000]"
                autofocus
                rows="20"
                :counter="1000"
              ></v-textarea>
            </v-form>
            <div>
              <small class="success--text">
                DEVA不是完美的，我们渴望您的建议
              </small>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="
                suggest.dialog = false
                suggest.resp = null
                suggest.content = null
              "
              >关闭
            </v-btn>
            <v-btn
              text
              color="primary"
              :loading="suggest.loading"
              @click="submitSuggest"
              ><strong>提交</strong>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <InfoDialog
        :msg="[
          '提交成功，感谢！有你的帮助，我们会变得更好。',
          suggest.result.resp && suggest.result.resp.msg
        ]"
        :succeed="suggest.result.resp != null && suggest.result.resp.succeed"
        :dialog="suggest.result.dialog"
        close-txt="关闭"
        @update:dialog="suggest.result.dialog = $event"
      >
      </InfoDialog>
    </div>
  </no-ssr>
</template>
<script>
import InfoDialog from './InfoDialog'
export default {
  components: { InfoDialog },
  data: () => ({
    fab: false,
    suggest: {
      content: null,
      loading: false,
      dialog: false,
      result: {
        resp: null,
        dialog: false
      }
    },
    rules: {
      max1000: (v) => (v && v.length <= 1000) || '不能超过1000个字符',
      min10: (v) => (v && v.length > 10) || '最少为10个字符哦'
    }
  }),
  methods: {
    toTop() {
      this.$vuetify.goTo(0, {
        duration: 245,
        offset: 0,
        easing: 'easeInCubic'
      })
    },
    submitSuggest() {
      if (!this.$refs.suggestForm.validate()) {
        return false
      }
      this.suggest.loading = true
      this.$axios
        .$post('/adminTask/createTask', {
          content: this.suggest.content
        })
        .then((resp) => {
          this.suggest.loading = false
          this.suggest.result.resp = resp
          this.suggest.result.dialog = true
          if (resp.succeed) {
            this.suggest.dialog = false
          }
        })
        .catch((e) => {
          this.suggest.loading = false
          this.suggest.dialog = false
        })
    }
  }
}
</script>
<style>
.v-speed-dial {
  bottom: 70px !important;
  right: 40px !important;
}
.v-btn-floating {
  position: relative;
}
</style>
