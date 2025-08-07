import http from '../../utils/http';
import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
    {
      title: '我发的群',
      tit: '',
      url: '',
      type: 'myGround',
    },
    {
      title: '我的奖励',
      tit: '',
      url: '',
      type: 'myReward',
    },
    {
      title: '我的任务',
      tit: '',
      url: '',
      type: 'task',
    },
    // {
    //   title: '分享给好友',
    //   tit: '',
    //   url: '',
    //   type: 'share',
    // },
    // {
    //   title: '客服热线',
    //   tit: '',
    //   url: '',
    //   type: 'service',
    // },
    // {
    //   title: '关注公众号',
    //   tit: '',
    //   url: '',
    //   type: 'follow_with_interest',
    // },
  ];

  const menuData2 = [
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
    },
    {
      title: '关注公众号',
      tit: '',
      url: '',
      type: 'follow_with_interest',
    },
  ];



const groundStatisticsList = [
  {
    title:"今日进群",
    number:"7",
  },
  {
    title:"累计进群",
    number:"7",
  },
  {
    title:"今日发布群",
    number:"7",
  },
  {
    title:"发布群",
    number:"7",
  },
];

const getDefaultData = () => ({
  // showMakePhone: false,
  userInfo: {
    avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
    nickName: wx.getStorageSync('userInfo').nickName,
    phoneNumber: '',
  },
  menuData,
  menuData2,
  customerServiceInfo: {},
  showKefu: true,
  versionNo: '',
  groundStatisticsList,
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
    this.getTabBar().init();
    this.init();
  },
  onPullDownRefresh() {
    this.init();
  },

  init() {
    // this.fetUseriInfoHandle();
    this.loadHomePage();
    this.getUserInfo();
  },

  getUserInfo(e){
    let info = wx.getStorageSync('wechatUser');
    console.log(info,'我是用户信息');
  },


onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '首页'
        })
      }, 100)
    })
    return {
      title: '首页',
      path: '/page/home/home',
      promise 
    }
  },


  loadHomePage(e){
    wx.stopPullDownRefresh();
         // 调用封装的接口
         http({
          url: '/api/wx/user/joinInfo',
          method: 'GET'
        })
          .then(res => {
            console.log('我的页面请求成功:', res );
            const updatedList = [
              {
                title: "今日进群",
                number: res.data.todayJoin || "0", 
              },
              {
                title: "累计进群",
                number: res.data.totalJoin || "0",
              },
              {
                title: "今日发布群",
                number: res.data.todayIssue || "0",
              },
              {
                title: "发布群",
                number: res.data.totalIssue || "0",
              },
            ];

            this.setData({
              groundStatisticsList: updatedList
            });
          })
          .catch(err => {
            if(err.code === 401){
              this.clearStorage();
            }
            console.error('请求失败:', err);
            wx.showToast({ title: '加载失败', icon: 'none' });
          });
  },


  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'myGround': {
        wx.navigateTo({ url: '/pages/mymessage/post-ground/index' });
        break;
      }
      case 'myReward': {
        wx.navigateTo({ url: '/pages/mymessage/my-reward/index' });
        // this.openMakePhone();
        break;
      }
      case 'task': {
        wx.navigateTo({ url: '/pages/mymessage/my-task/index' });
        // Toast({
        //   context: this,
        //   selector: '#t-toast',
        //   message: '我的任务',
        //   icon: '',
        //   duration: 1000,
        // });
        break;
      }
      case 'share': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '分享给好友',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'service': {
        wx.navigateTo({ url: '/pages/mymessage/my-customerservice/index' });
        break;
      }
      default: {
        wx.navigateTo({ url: '/pages/mymessage/my-officialaccount/index' });
        // Toast({
        //   context: this,
        //   selector: '#t-toast',
        //   message: '未知跳转',
        //   icon: '',
        //   duration: 1000,
        // });
        break;
      }
    }
  },


  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage() {
    // 这一块写签到逻辑


    // const { currAuthStep } = this.data;
    // if (currAuthStep === 2) {
    //   wx.navigateTo({ url: '/pages/user/person-info/index' });
    // } else {
    //   this.fetUseriInfoHandle();
    // }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },

  clearStorage(){
    wx.clearStorageSync(); // 同步方法
    wx.switchTab({
      url: '/pages/home/home'
    });
  }

});
