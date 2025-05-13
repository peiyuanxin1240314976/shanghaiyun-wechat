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
    {
      title: '分享给好友',
      tit: '',
      url: '',
      type: 'share',
    },
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
    avatarUrl: '',
    nickName: '正在登录...',
    phoneNumber: '',
  },
  menuData,
  customerServiceInfo: {},
  currAuthStep: 1,
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
  },


  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'myGround': {
        wx.navigateTo({ url: '/pages/mymessage/post-ground/index' });
        // wx.navigateTo({ url: '/pages/user/address/list/index' });
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
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/user/person-info/index' });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
