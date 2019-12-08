export default () => ({
  userInfo: null,
  useMarkdown: false,
  // 控制显示底部条
  showFooter: false,
  unReadMessageCount: 0,
  // 全局异常
  systemError: {
    // 监听该值来弹出错误提示
    alertFlag: 0,
    msg: ''
  },
  webpSupport: false
})
