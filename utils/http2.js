const BASE_URL = 'https://h5.cloud2.shy-info.com';
const http2 = (options) => {
  // 显示Loading
  wx.showLoading({ title: '加载中...' });

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('wechattoken'), // 自动携带token
        'token':wx.getStorageSync('wechattoken')
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if(res.statusCode === 401){
            wx.navigateTo({
              url: '/pages/user/login/index',
            })
        }else {
          reject(res.data,'报错了'); // 状态码非200视为错误
        }
      },
      fail: (err) => {
        reject(err,'报错了');
      },
      complete: () => {
        wx.hideLoading(); // 隐藏Loading
      }
    });
  });
};

export default http2;