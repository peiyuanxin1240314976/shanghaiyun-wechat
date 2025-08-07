// pages/search/history.js
Page({
  data: {
    value:'',
    // dialogShow:false,
    // dialog:{
    //   message:''
    // },
    // 假数据 - 最近搜索
    searchList: [
    ],
    // 假数据 - 浏览记录
    takeFirst9List: [
    ]
  },

  handleSubmit(val){
    // console.log('11',val);
    // const val = this.data.value.trim();
    if (!val.detail.value) return;
    this.saveSearchRecord(val.detail.value);
    // 跳转到首页或其他页面
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  onLoad() {
    // 初始化时从本地存储加载搜索记录
    this.loadSearchHistory();
  },

  loadSearchHistory() {
    try {
      const searchInfo = wx.getStorageSync('weChatsearch')?.searchInfo || [];
      this.setData({
        searchList: this.takeLast(searchInfo, 5), // 最近5条
        takeFirst9List: this.takeFirst9(searchInfo) // 前9条
      });
    } catch (e) {
      console.error('读取搜索记录失败:', e);
    }
  },

    // 保存搜索记录到本地存储
  saveSearchRecord(info) {
      try {
        const currentTime = new Date();
        const existingData = wx.getStorageSync('weChatsearch') || {};
        const searchInfo = existingData.searchInfo || [];
        
        // 避免重复记录
        const existingIndex = searchInfo.findIndex(item => item.info === info);
        if (existingIndex !== -1) {
          searchInfo.splice(existingIndex, 1);
        }
        
        // 添加新记录到开头
        searchInfo.unshift({ date: currentTime, info });
        
        // 保存到本地存储
        wx.setStorageSync('weChatsearch', {
          ...existingData,
          searchInfo
        });

        // 储存一个单独的内容用来搜索
        wx.setStorageSync('weChatSearchInfo',info);
        
        // 更新页面数据
        this.loadSearchHistory();
      } catch (e) {
        console.error('保存搜索记录失败:', e);
      }
    },

  // 点击最近搜索项
  recentlyClick: function(e) {
    const val = e.currentTarget.dataset.info;
    this.setData({ value: val });
    // console.log(val);
    // debugger
    this.saveSearchRecord(val);
    // 跳转到首页或其他页面
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 删除单个记录
   deleteOne(e) {
    const val = e.currentTarget.dataset.info;
    const { takeFirst9List } = this.data;
    const index = takeFirst9List.findIndex(item => item.info === val);
    
    if (index !== -1) {
      // 从数组中删除
      takeFirst9List.splice(index, 1);
      
      // 更新本地存储
      try {
        const existingData = wx.getStorageSync('weChatsearch') || {};
        wx.setStorageSync('weChatsearch', {
          ...existingData,
          searchInfo: takeFirst9List
        });
        
        // 更新页面数据
        this.setData({ takeFirst9List });
      } catch (e) {
        console.error('删除搜索记录失败:', e);
      }
    }
  },

  // 删除全部记录
  allDelete() {
    wx.showModal({
      title: '提醒',
      content: '确认删除全部搜索记录吗?',
      success: (res) => {
        if (res.confirm) {
          try {
            const existingData = wx.getStorageSync('weChatsearch') || {};
            wx.setStorageSync('weChatsearch', {
              ...existingData,
              searchInfo: []
            });
            
            // 更新页面数据
            this.setData({
              searchList: [],
              takeFirst9List: []
            });
          } catch (e) {
            console.error('清空搜索记录失败:', e);
          }
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'none'
          });
        }
      }
    });
  },


    // 清空输入框并返回首页
    onClickButton() {
      this.setData({ value: '' });
      wx.switchTab({
        url: '/pages/home/home'
      });
    },

      // 工具函数 - 获取最后n条
  takeLast(arr, n) {
    return arr.slice(-n).reverse();
  },

  // 工具函数 - 获取前9条
  takeFirst9(arr) {
    return arr.slice(0, 9);
  }
});