<!-- 自定义组件参考 https://codesandbox.io/s/o29j95wx9 -->
<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card>
      <v-card-title
        :class="(succeed ? 'success' : 'error') + '--text'"
        class="subtitle-1"
      >
        {{ succeed ? msg[0] : msg[1] }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- 组件事件绑定https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model -->
        <v-btn small text @click="$emit('update:dialog', false)">{{
          closeTxt
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    succeed: {
      type: Boolean,
      required: true
    },
    dialog: {
      type: Boolean,
      required: true
    },
    // 提示信息数组, 第一个是成功提示, 第二个是失败提示
    msg: {
      type: Array,
      required: true
    },
    closeTxt: {
      type: String,
      required: false,
      default: '关闭'
    }
  },
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {}
}
</script>
