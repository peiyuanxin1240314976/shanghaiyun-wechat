Page({
  data: {
    // 假数据配置
    userInfo: {
      points: 1200,
      signDays: 5
    },
    signDays: [
      { week: "周一", status: true },
      { week: "周二", status: true },
      { week: "周三", status: true },
      { week: "周四", status: false },
      { week: "周五", status: false },
      { week: "周六", status: false },
      { week: "周日", status: false }
    ]
  },

  // 事件处理
  // onClickLeft() {
  //   wx.navigateBack()
  // },

  onClickRight() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  sign(e) {
    const index = e.currentTarget.dataset.index
    // 签到逻辑...
  }
})