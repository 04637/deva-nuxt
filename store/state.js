export default () => ({
  userInfo: null,
  darkTheme: true,
  unReadMessageCount: 0,
  // 全局异常
  systemError: {
    // 监听该值来弹出错误提示
    alertFlag: 0,
    msg: ''
  },
  // 监听该值来控制重新加载控件列表
  reloadSpaceFlag: 0
})
