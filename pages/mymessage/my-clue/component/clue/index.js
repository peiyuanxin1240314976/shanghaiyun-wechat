Page({
  data: {
    // 关闭弹窗的icon
    closeIcon:'close',
    list: [
      {
        id:1,
        title: "深圳市腾讯计算机有限公司1",
        linkPhone: "18888888888",
        icon: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/9cf7637d-9a16-491a-8f03-2af412b1d0c9.png", // 假图片路径
        status: 0 // 0-已领取 1-已完成
      },
      {
        id:2,
        title: "深圳市腾讯计算机有限公司2",
        linkPhone: "18888888888",
        icon: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/9cf7637d-9a16-491a-8f03-2af412b1d0c9.png",
        status: 1
      },
      {
        id:3,
        title: "深圳市腾讯计算机有限公司3",
        linkPhone: "18888888888",
        icon: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/9cf7637d-9a16-491a-8f03-2af412b1d0c9.png",
        status: 0
      }
    ],

    // 弹窗需要的值
    cur: {},

    arealist:[
      {
        id:1,
        name:'号码准确',
      },
      {
        id:2,
        name:'空号',
      },
      {
        id:3,
        name:'无人接听',
      },
      {
        id:4,
        name:'号码错误',
      },
    ],
    activeAreaId: null,
  },

  flowUp(e){
    const index = e.currentTarget.dataset.index
    const item = this.data.list[index]
    console.log(item);
    this.setData(
      {
        cur: item,
      },
      () => {
        this.setData({ visible: true });
      },
    );
  },

  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },

  onClose(e){
    this.setData({
      visible: false,
    });
  },

  choseBtn(e){
    this.setData({ activeAreaId:e.currentTarget.dataset.id });
  }
})