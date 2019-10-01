<!-- 自定义组件参考 https://codesandbox.io/s/o29j95wx9 -->
<template>
  <v-dialog
    :value="dialog && $store.getters.getErrorMsg"
    persistent
    max-width="20vw"
  >
    <v-card>
      <v-card-title class="error--text subtitle-1">
        {{ $store.getters.getErrorMsg }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- 组件事件绑定https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model -->
        <v-btn
          text
          @click="
            $emit('update:dialog', false)
            $store.commit('setErrorMsg', '')
          "
          >关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {}
}
</script>
