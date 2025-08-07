import http from '../../utils/http';

// 封装通用方法
const utils = {
  downloadFile: url => new Promise((resolve, reject) => {
    wx.downloadFile({ url, success: resolve, fail: reject });
  }),
  getImageInfo: src => new Promise((resolve, reject) => {
    wx.getImageInfo({ src, success: resolve, fail: reject });
  }),
  canvasToTempFilePath: () => new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvasId: 'compositeCanvas',
      success: resolve,
      fail: reject
    });
  })
};


Page({
  data: {
    current: 0,
    autoplay: false,
    duration: 500,
    interval: 5000,
    swiperList: [], // 初始为空，将在onLoad中生成合成图
    imageSrc: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/a517e099-1ded-43af-a815-7082f463399b.jpg',
    link: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/1c55a79c-e48b-4be9-b1a4-dec24054ea9f.png",
    tu: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/093f750d-1808-4791-ba44-1cd44697805b.png",
    weixin: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/70f25438-eb2b-4f24-95cf-d60a9f18cd7d.png",
    pengyouquan: "https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/91c5a973-aa0a-4ce9-b5f4-2f25edf5d0bc.png",
    qrimageSrc: '',
    originalSwiperList:[],
  },

  onLoad() {
    this.init();
  },

//  初始化
  init() {
    const token = wx.getStorageSync('wechattoken');
    if(token){
      // this.generateCompositeImages();
      this.loadHomePage();
    }else{
      this.setData({
        swiperList: [
          'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/3b9111f7-402e-4f05-986d-bf4717bcd38b.png',
          'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/586ff94e-81d2-4107-82e2-5bfd7a81949d.png',
          'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/baed455b-dc1c-4d58-a4a8-b1bbb8994021.png'
        ]
      })
    }

    // this.loadHomePage();
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
    // 直接在 Page 中定义分享回调
    // onShareAppMessage() {
    //   return {
    //     title: '分享给好友的标题',
    //     path: '/pages/home/home',
    //     success(res) {
    //       console.log('onShareAppMessage分享成功', res); // 成功回调（仅部分版本支持）
    //     },
    //     fail(err) {
    //       console.error('onShareAppMessage分享失败', err); // 失败回调（仅部分版本支持）
    //     }
    //   };
    // },
  
    onShareTimeline() {
      return {
        title: '分享到朋友圈的标题',
        success(res) {
          console.log('onShareTimeline分享成功', res); // 成功回调（仅部分版本支持）
        },
        fail(err) {
          console.error('onShareTimeline分享失败', err); // 失败回调（仅部分版本支持）
        }
      };
    },

  loadHomePage() {
     // 调用封装的接口
     http({
      url: '/api/wx/home/getConfig',
      method: 'GET',
      data: { type: '页面设置' }
    })
      .then(res => {
        console.log('宣传海报请求成功:', JSON.parse(res.data)  );
        let token = wx.getStorageSync('wechattoken');
        if(!token){
          wx.navigateTo({
            url: '/pages/user/login/index',
          })
          return false;
        }
        if(res.code === 0){
          let configList = JSON.parse(res.data);
          let postImages = [];
          configList.posterImages.map(element => {
            postImages.push(element.imageUrl);
          });
          let info = wx.getStorageSync('wechatUser');
          this.setData({ 
            originalSwiperList:postImages,
            qrimageSrc:info.shareQr
           });
          // console.log(postImages,'postImages');

            this.generateCompositeImages();
      
        }
      })
      .catch(err => {
        if(err.code === 401){
          this.clearStorage();
        }
        console.error('请求失败:', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });

  },
  clearStorage(){
    wx.clearStorageSync(); // 同步方法
    wx.switchTab({
      url: '/pages/home/home'
    });
  },

  // 生成合成图片
async generateCompositeImages() {
  wx.showLoading({ title: '生成图片中...' });
  try {
    const swiperList = [];
    for (const imgUrl of this.data.originalSwiperList) {
      const [res1, res2] = await Promise.all([
        utils.downloadFile(imgUrl),
        utils.downloadFile(this.data.qrimageSrc)
      ]);
      const { width, height } = await utils.getImageInfo(res1.tempFilePath);
      const ctx = wx.createCanvasContext('compositeCanvas');
      
      // 清空并绘制
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(res1.tempFilePath, 0, 0, width, height);
      
      // 动态计算二维码尺寸和坐标（修改这里）
      const qrSize = Math.min(width, height) * 0.5;
      const qrX = (width - qrSize) / 2  // 水平居中
      const qrY = (height - qrSize) / 2 // 垂直居中
      
      ctx.drawImage(
        res2.tempFilePath,
        qrX,    // 修改后的X坐标
        qrY,    // 修改后的Y坐标
        qrSize,
        qrSize
      );
      
      // 导出并保存
      ctx.draw();
      const { tempFilePath } = await utils.canvasToTempFilePath();
      swiperList.push(tempFilePath);
    }
    this.setData({ swiperList });
  } catch (error) {
    wx.showToast({ title: '生成失败', icon: 'none' });
  }
  wx.hideLoading();
},

  // 其他原有方法保持不变
  onChange(e) {
    const { detail: { current, source } } = e;
    console.log(current, source);
    this.setData({ current:current });
  },


  // 复制动态生成的链接（示例）
  copyDynamicLink() {
    const path = '/pages/home/home';
    const link = `https://blog.shy-info.com${path}`; // 动态拼接链接
    wx.setClipboardData({
      data: link,
      success() {
        wx.showToast({ title: '复制成功' });
      }
    });
  },

  // 分享图片
  showShare(e){
    const { current, swiperList } = this.data;
    const tempFilePath = swiperList[current]; // 已经是本地临时路径
    wx.showShareImageMenu({
      path: tempFilePath // 直接使用临时文件路径
    });
  },


  // 保存海报
  savePoster(e) {
    const { current, swiperList } = this.data;
    const imageUrl = swiperList[current];
  
    // 1. 先检查是否有相册权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
            // 已有权限，直接下载并保存
            this.downloadAndSaveImage(imageUrl);
        } else {
            // 2. 没有权限，先申请权限
            wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                    // 用户同意授权，下载并保存
                    this.downloadAndSaveImage(imageUrl);
                },
                fail: () => {
                    // 用户拒绝授权，引导用户去设置页开启
                    this.showPermissionModal();
                }
            });
        }
      },
      fail: () => {
        wx.showToast({ title: '权限检查失败', icon: 'none' });
      }
    });
  },
  
  // 下载图片并保存到相册
  downloadAndSaveImage(imageUrl) {
    wx.saveImageToPhotosAlbum({
      filePath: imageUrl,
      success: () => {
        wx.showToast({ title: '保存成功', icon: 'success' });
      },
      fail: (err) => {
        wx.showToast({err})
        console.error('保存失败:', err);
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },
  
  // 显示权限引导弹窗
  showPermissionModal() {
    wx.showModal({
      title: '权限提示',
      content: '需要您授权保存图片到相册，请前往设置开启权限',
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          wx.openSetting(); // 跳转到权限设置页
        }
      }
    });
  },

  // onShareAppMessage() {
  //   const promise = new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve({
  //         title: '首页'
  //       })
  //     }, 100)
  //   })
  //   return {
  //     title: '首页',
  //     path: '/page/home/home',
  //     promise 
  //   }
  // },


  // 手动触发分享（如按钮点击）
  handleShare() {
    wx.showToast({ title: '请点击右上角分享朋友圈',icon: 'none' });
  },

  // 点击轮播图
  clickCurrent(e){
    let current = e.detail.index;
    wx.previewImage({
      current: this.data.swiperList[current], // 当前显示图片的http链接
      urls: [this.data.swiperList[current]] // 需要预览的图片http链接列表
    })
    // console.log(this.data.originalSwiperList[current]);
  },

  // 其他生命周期方法保持不变
  onShow() {
    this.getTabBar().init();
    this.init();
  }
});