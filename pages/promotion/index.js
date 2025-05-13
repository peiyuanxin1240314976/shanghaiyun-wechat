const qrimageSrc = 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/31ecb44c-240b-4a94-942e-7a5baf66ed73.png';

const originalSwiperList = [
  'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/2211c3af-3727-42ba-aab6-e523312381d3.png',
  'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/0f2c116e-9380-41f0-99f5-a499b644485f.png',
  'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/067d9d95-0ae7-4b90-972f-d3b7210aaa3a.png'
];

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
    qrimageSrc: qrimageSrc
  },

  onLoad() {
    this.generateCompositeImages();
  },

  // 生成合成图片
  generateCompositeImages() {
    const ctx = wx.createCanvasContext('compositeCanvas');
    const compositeImages = [];
    const qrSize = 80; // 二维码大小
    const qrMargin = 20; // 二维码边距
    
    // 显示加载中
    wx.showLoading({
      title: '图片生成中...',
      mask: true
    });
    
    // 遍历原始图片数组
    originalSwiperList.forEach((imgUrl, index) => {
      // 下载原始图片
      wx.downloadFile({
        url: imgUrl,
        success: (res1) => {
          // 下载二维码图片
          wx.downloadFile({
            url: qrimageSrc,
            success: (res2) => {
              // 获取图片信息
              wx.getImageInfo({
                src: res1.tempFilePath,
                success: (imgInfo) => {
                  const { width, height } = imgInfo;
                  
                  // 绘制原始图片
                  ctx.drawImage(res1.tempFilePath, 0, 0, width, height);
                  
                  // 绘制二维码（放在右下角）
                  ctx.drawImage(
                    res2.tempFilePath, 
                    width - qrSize - qrMargin, 
                    height - qrSize - qrMargin, 
                    qrSize, 
                    qrSize
                  );
                  
                  // 绘制完成
                  ctx.draw(false, () => {
                    // 将画布内容导出为临时文件
                    wx.canvasToTempFilePath({
                      canvasId: 'compositeCanvas',
                      success: (res3) => {
                        compositeImages[index] = res3.tempFilePath;
                        
                        // 当所有图片都处理完成
                        if (compositeImages.length === originalSwiperList.length && !compositeImages.includes(undefined)) {
                          this.setData({
                            swiperList: compositeImages
                          });
                          wx.hideLoading();
                        }
                      },
                      fail: (err) => {
                        console.error('导出图片失败:', err);
                        wx.hideLoading();
                      }
                    });
                  });
                },
                fail: (err) => {
                  console.error('获取图片信息失败:', err);
                  wx.hideLoading();
                }
              });
            },
            fail: (err) => {
              console.error('下载二维码失败:', err);
              wx.hideLoading();
            }
          });
        },
        fail: (err) => {
          console.error('下载原图失败:', err);
          wx.hideLoading();
        }
      });
    });
  },

  // 其他原有方法保持不变
  onChange(e) {
    const { detail: { current, source } } = e;
    console.log(current, source);
  },

  copyLink(e) {
    console.log(e);
  },

  savePoster(e) {
    // 保存当前显示的合成图片
    const { current } = this.data;
    const imageUrl = this.data.swiperList[current];
    
    wx.downloadFile({
      url: imageUrl,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail: () => {
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        });
      },
      fail: () => {
        wx.showToast({
          title: '下载图片失败',
          icon: 'none'
        });
      }
    });
  },

  showShare(e) {
    console.log(e);
  },

  // 其他生命周期方法保持不变
  onShow() {
    this.getTabBar().init();
  }
});