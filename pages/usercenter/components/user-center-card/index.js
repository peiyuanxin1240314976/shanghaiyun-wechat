import http from '../.././../../utils/http';

Component({
  options: {
    multipleSlots: true,
  },
  properties: {

    userInfo: {
      type: Object,
      value: {},
    },
    isNeedGetUserInfo: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    defaultAvatarUrl: 'https://tdesign.gtimg.com/miniprogram/template/retail/usercenter/icon-user-center-avatar@2x.png',
    needSign: false,
  },

  // 生命周期函数
  lifetimes: {
    attached: function () {
      // 进入页面时自动调用
      this.getUserInfo();
    },
  },
  methods: {
    gotoUserEditPage() {
      this.triggerEvent('gotoUserEditPage');
    },

    // 去签到
    goSign() {
      // 调用封装的接口
      http({
        url: '/api/wx/user/sign',
        method: 'GET'
      })
        .then(data => {
          if (data.code === 0) {
            // wx.showToast({ title: '签到成功' });
            this.getUserInfo();
          }
        })
        .catch(err => {
          console.error('请求失败:', err);
          wx.showToast({ title: '加载失败', icon: 'none' });
        });
    },

    getUserInfo() {
      http({
        url: '/api/wx/user/info',
        method: 'GET'
      }).then(res => {
        if (res.code === 0) {
          if (res.code === 0) {
            this.setData({
              needSign: res.data.needSign
            })
            // needSign.value = res.data.needSign;
          }
        }
      })
    }
  },
});
