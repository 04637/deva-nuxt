<template>
  <v-app v-if="spaceInfo" justify-center align-start shrink>
    <v-layout column shrink>
      <v-card-title>空间管理</v-card-title>
      <v-divider></v-divider>
    </v-layout>
    <v-layout justify-space-around shrink class="mt-6">
      <v-card class="pa-8" width="520px">
        <v-form ref="form">
          <v-layout justify-space-around column class="mt-3">
            <v-layout class="mt-4">
              <v-text-field
                v-model="spaceInfo.spaceName"
                :counter="20"
                label="空间名"
                outlined
                required
                :rules="[rules.min, rules.max]"
              ></v-text-field>
            </v-layout>
            <v-layout class="mt-4">
              <v-textarea
                v-model="spaceInfo.description"
                :counter="200"
                label="空间描述"
                outlined
                required
                no-resize
              ></v-textarea>
            </v-layout>
            <v-layout justify-end class="mt-4">
              <v-btn
                outlined
                accent
                depressed
                min-width="150px"
                :loading="createResult.loading"
                >更新空间信息</v-btn
              >
            </v-layout>
          </v-layout>
        </v-form>
      </v-card>
      <v-card class="pa-2">
        <v-toolbar dense flat>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>

          <v-toolbar-title style="font-size: 1rem">空间成员</v-toolbar-title>

          <div class="flex-grow-1"></div>

          <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list class="pa-0 mt-2" subheader>
          <v-list-item
            v-for="user in spaceInfo.members"
            :key="user.userId"
            style="min-width: 200px"
          >
            <v-list-item-avatar color="grey">
              <v-img :src="user.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              {{ user.nickname || user.username }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-card>
    </v-layout>
    <InfoDialog
      :msg="['创建成功', '创建失败']"
      :succeed="createResult.resp != null && createResult.resp.succeed"
      :dialog="createResult.dialog"
      @update:dialog="createResult.dialog = $event"
    >
    </InfoDialog>
  </v-app>
</template>
<script>
import InfoDialog from '../../components/InfoDialog'
export default {
  components: {
    InfoDialog
  },
  middleware: 'authenticated',
  data: () => ({
    spaceInfo: null,
    createResult: {
      loading: false,
      resp: null,
      dialog: false
    },
    rules: {
      min: (v) => (v && v.length >= 2) || '最少两个字符',
      max: (v) => (v && v.length <= 20) || '最多20个字符'
    }
  }),
  created() {
    this.loadSpaceInfo()
  },
  methods: {
    loadSpaceInfo() {
      this.$axios
        .$post('/spaceInfo/getSpaceDetail', {
          spaceId: this.$route.query.spaceId
        })
        .then((resp) => {
          if (resp.succeed) {
            this.spaceInfo = resp.data
          }
        })
    }
  }
}
</script>

<style scoped></style>
