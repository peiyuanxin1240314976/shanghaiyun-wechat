

Component({
  properties:{
    taskList:{
      type: Array,
      value: [],
      observer(data) {
        if (!data) {
          return;
        }
        this.setData({ list: data });
      },
    }
  },

  data: {
    icon: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/e0c162cd-9873-4b26-8cd7-5478068ea71a.png",
    list: [
    ]
  },

  methods:{
    toUrl(e){
      const { title }  = e.currentTarget.dataset.info;
      switch (title) {
        case '邀请分享':
          wx.switchTab({
            url: '/pages/promotion/index'
          });
          break;
        case '反馈有礼':
          wx.switchTab({
            url: '/pages/home/home'
          });
          break;
        case '首次发布信息':
          wx.switchTab({
            url: '/pages/category/index'
          });
          break;
      
        default:
          break;
      }
    }
  }
})