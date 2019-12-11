<template>
  <v-app justify-center align-start shrink>
    <v-layout column shrink>
      <v-card-title>空间创建</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-center shrink>
      <v-card class="pa-8 mt-6" width="520px">
        <logo type="form"></logo>
        <v-form ref="form">
          <v-layout justify-space-around column class="mt-3">
            <v-layout class="mt-4">
              <v-text-field
                v-model="spaceName"
                hint="空间的名称"
                :counter="20"
                label="空间名"
                outlined
                required
                :rules="[rules.min, rules.max]"
              ></v-text-field>
            </v-layout>
            <v-layout class="mt-4">
              <v-textarea
                v-model="description"
                hint="空间的简短描述"
                :counter="200"
                label="空间描述"
                outlined
                required
                no-resize
                :rules="[rules.max200]"
              ></v-textarea>
            </v-layout>
            <small class="my_gray--text"
              >空间是一个私密社区，空间内的问答只对其成员可见</small
            >
            <v-layout justify-end class="mt-5">
              <v-btn
                color="primary"
                accent
                depressed
                min-width="100%"
                :loading="createResult.loading"
                @click="createSpace"
                >创建空间</v-btn
              >
            </v-layout>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
    <InfoDialog
      :msg="['创建成功', '创建失败']"
      :succeed="createResult.resp != null && createResult.resp.succeed"
      :dialog="createResult.dialog"
      close-txt="去查看"
      @update:dialog="
        createResult.dialog = $event
        $router.push(
          '/space/manageSpace?spaceId=' + createResult.resp.data.spaceId
        )
      "
    >
    </InfoDialog>
  </v-app>
</template>
<script>
import InfoDialog from '../../components/dialog/InfoDialog'
import Logo from '../../components/Logo'
export default {
  components: {
    InfoDialog,
    Logo
  },
  middleware: 'authenticated',
  data: () => ({
    rules: {
      min: (v) => (v && v.length >= 2) || '最少两个字符',
      max: (v) => !v || (v && v.length <= 20) || '最多20个字符',
      max200: (v) => !v || (v && v.length <= 200) || '最多200个字符'
    },
    spaceName: null,
    description: null,
    createResult: {
      loading: false,
      resp: null,
      dialog: false
    }
  }),
  methods: {
    createSpace() {
      if (!this.$refs.form.validate()) {
        return false
      }
      this.createResult.loading = true
      this.$axios
        .$post('/spaceInfo/createSpace', {
          spaceName: this.spaceName,
          description: this.description
        })
        .then((resp) => {
          this.createResult.dialog = true
          this.createResult.loading = false
          this.createResult.resp = resp
          if (resp.succeed) {
            this.$store.commit('needReloadSpaceList')
          }
        })
        .catch((e) => {
          this.createResult.loading = false
        })
    }
  }
}
</script>

<style scoped></style>
