Page({
  data: {
    list: [
      {
        title: "每日签到",
        description: "8",
        icon: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/e0c162cd-9873-4b26-8cd7-5478068ea71a.png", // 假图片路径
        createTime:"2025-02-25 14:00:21" ,
        type:"点数"
      },
      {
        title: "邀请好友",
        description: "1",
        icon: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/e0c162cd-9873-4b26-8cd7-5478068ea71a.png",
        createTime:"2025-02-25 14:00:21",
        type:"点数"
      },
      {
        title: "完善资料",
        description: "20",
        icon: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/e0c162cd-9873-4b26-8cd7-5478068ea71a.png",
        createTime:"2025-02-25 14:00:21",
        type:"线索"
      }
    ]
  },

  toUrl(e){
    const { item } = e.currentTarget.dataset;
    console.log(item);
    if(item.type === "线索"){
      wx.navigateTo({ url: '/pages/mymessage/my-clue/index' });
    }
  }
})