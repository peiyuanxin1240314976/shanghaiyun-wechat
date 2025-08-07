import http from '../../../utils/http';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:"全部",
    list:[]
  },


  init() {
    this.loadHomePage(this.data.active);
  },

  onTabsChange(e){
    this.loadHomePage(e.detail.value);
  },

  onTabsClick(e){
    console.log(e);
  },

  loadHomePage(active) {
    let query = {
      page:1,
      current:100,
    }
    wx.stopPullDownRefresh();
     // 调用封装的接口
     http({
      url: '/api/wx/user/reward',
      method: 'POST',
      data: { ...query ,type:active}
    })
      .then(res => {
        console.log('请求成功:', res.data );
        if(res.code === 0){
           this.setData({list:res.data.records});
          // this.setData({ list: [
          //   {id:'1',type:'线索',title:'每日签到',createTime:'2025-02-25 14:00:21',number:8},
          //   {id:'2',type:'点数',title:'邀请好友',createTime:'2025-02-25 14:00:21',number:9}
          // ] })
        }else if(res.code === 401){
          console.log('跳转登录');
        }
      })
      .catch(err => {
        console.error('请求失败:', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})