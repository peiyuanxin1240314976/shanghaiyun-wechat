// pages/login/login.js
import http from '../../../utils/http'

Page({
  data: {
    checked: false,
    userInfo:{}
  },

  // 处理登录
 async handleLogin() {
  if (!this.data.checked) {
    wx.showToast({
      title: '请先同意隐私协议！',
      icon: 'none',
      duration: 2000
    })
    return
  }

  try {
    const res = await new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善个人资料',
        success: resolve,
        fail: reject
      });
    });
    console.log("真实用户信息：", res.userInfo);
    this.setData({ userInfo: res.userInfo });
    wx.setStorageSync('userInfo', res.userInfo)
  } catch (err) {
    console.error("用户拒绝授权：", err);
  }


    // 微信登录逻辑
    wx.login({
      success: res => {
        if (res.code) {
          http({
            url: '/api/wx/user/miniLogin',
            method: 'GET',
            data: { code:res.code,share:'' }
          })
            .then(res => {
              console.log('登录成功:', res.data );
              wx.setStorageSync('wechattoken', res.data.token);
              wx.setStorageSync('wechatUser', res.data);
              wx.switchTab({
                url: '/pages/home/home'
              })
            })
            .catch(err => {
              console.error('请求失败:', err);
              wx.showToast({ title: '加载失败', icon: 'none' });
            });
          console.log(res,'res');
          // this.getUserInfo(res.code)
        }
      }
    })
  },

  // 获取用户
  onGetUserInfoLegacy(e){
    // if (e.detail.userInfo) {
    //   this.setData({ userInfo: e.detail.userInfo });
    //   wx.setStorageSync('userInfo', e.detail.userInfo)
    // }
  },
  
  // handleGetPhoneNumber(e) {
  //   debugger
  //   if (e.detail.errMsg === 'getPhoneNumber:ok') {
  //     const { encryptedData, iv } = e.detail
  //     // 将 encryptedData 和 iv 发送到后端解密
  //     wx.request({
  //       url: 'your-backend-api',
  //       method: 'POST',
  //       data: { encryptedData, iv },
  //       success: res => {
  //         // 处理登录成功逻辑
  //       }
  //     })
  //   }
  // },

  // 勾选框变化
  handleCheckboxChange(e) {
    this.setData({
      checked: e.detail.checked
    })
  },

  // 跳转协议
  navigateToAgreement() {
    console.log('跳转用户服务协议');
    wx.navigateTo({
      url: '/pages/agreement/service/index'
    })
  },

  // 跳转隐私协议
  navigateToPrivacy() {
    console.log('跳转隐私协议');
    wx.navigateTo({
      url: '/pages/agreement/service/index'
    })
  },

  // 跳转隐私协议
  goHome() {
    console.log('返回首页');
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
})