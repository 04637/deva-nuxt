export default () => ({
  userInfo: null,
  // 手机绑定弹框
  phoneDialog: false,
  useMarkdown: false,
  // 控制显示底部条
  showFooter: false,
  unReadMessageCount: 0,
  // 使头部透明化
  transparentHeader: false,
  // 全局异常
  systemError: {
    // 监听该值来弹出错误提示
    alertFlag: 0,
    msg: ''
  },
  webpSupport: false
})
