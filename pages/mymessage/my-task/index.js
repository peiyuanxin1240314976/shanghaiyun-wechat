import http from '../../../utils/http';
const { getWeekday } = require('../../../utils/util');

Component({
  data: {
    // 假数据配置
    userInfo: {
      points: 1200,
      signDays: 5
    },
    signDays: [
    ],

    taskList:[]
  },

  // 事件处理
  // onClickLeft() {
  //   wx.navigateBack()
  // },

  methods:{
    // 获取签到数据
    fetchSignData() {
      http({
        url: '/api/wx/user/sinHistory',
        method: 'GET',
      })
        .then(res => {
          if(res.code === 0){
            res.data.map(el=>{
              el.week = getWeekday(el.date);
            });
            this.setData({ signDays:res.data })
          }else if(res.code === 401){
            console.log('跳转登陆页面');
          }
        })
        .catch(err => {
          console.error('请求失败:', err);
          wx.showToast({ title: '加载失败', icon: 'none' });
        });
    },

    // 获取任务数据
    fetchTaskData() {
      http({
        url: '/api/wx/user/task',
        method: 'POST',
      })
        .then(res => {
          if(res.code === 0){
            this.setData({ taskList:res.data })
          }else if(res.code === 401){
            console.log('跳转登陆页面');
          }
        })
        .catch(err => {
          console.error('请求失败:', err);
          wx.showToast({ title: '加载失败', icon: 'none' });
        });
    },

    init(){
      let info = wx.getStorageSync('wechatUser');
      this.setData({
        'userInfo.points':info.points,
        'userInfo.signDays':info.signDays,
      })

      // 开启分享好友和朋友圈功能
      this.openShare();
    },

      // 开启分享好友和朋友圈功能
      openShare(){
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        });
      },
    onLoad() {
      this.init();
      this.fetchSignData();
      this.fetchTaskData();
    },
    onClickRight() {
      wx.switchTab({
        url: '/pages/home/home'
      })
    },
  
    sign(e) {
      const index = e.currentTarget.dataset.index
      // 签到逻辑...
    },


  }

})