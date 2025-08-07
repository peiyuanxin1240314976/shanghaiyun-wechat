Component({
  properties: {
    rewardValue: {
      type: Array,
      value: [],
      observer: function(newVal) { // 添加监听器
        console.log('[DEBUG] 收到父组件数据:', newVal)
      }
    },
  },


  data: {
    icon:'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/e0c162cd-9873-4b26-8cd7-5478068ea71a.png',
  },

  methods:{
    toUrl(e){
      const { item } = e.currentTarget.dataset;
      console.log(item);
      if(item.type === "线索"){
        wx.navigateTo({ url: '/pages/mymessage/my-clue/index' });
      }
    }
  }
});
