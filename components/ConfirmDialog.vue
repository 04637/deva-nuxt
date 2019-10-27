<!-- 自定义组件参考 https://codesandbox.io/s/o29j95wx9 -->
<template>
  <v-dialog v-model="dialog" persistent max-width="20vw">
    <v-card>
      <v-card-title class="warning--text subtitle-1">
        {{ msg }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- 组件事件绑定https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model -->
        <v-btn text @click="$emit('update:dialog', false)">取消 </v-btn>
        <v-btn
          color="primary"
          text
          @click="
            $emit('update:dialog', false)
            confirm()
          "
          ><strong>确定</strong>
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
    },
    // 提示信息
    msg: {
      type: String,
      required: true
    },
    // 子组件调用父组件方法参考 https://juejin.im/post/5c1370365188250f73759a79
    // 点击确定后执行的方法
    todo: {
      type: Function,
      required: true
    },
    todoParam: {
      type: String,
      required: false,
      default: null
    }
  },
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {
    confirm() {
      this.todo(this.todoParam)
    }
  }
}
</script>
