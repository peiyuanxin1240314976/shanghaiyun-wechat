import http from '../../utils/http'
// import areaList from './area';
import { areaGround } from '../../utils/area';
const getOptions = (obj, filter) => {
  const res = Object.keys(obj).map((key) => ({ value: key, label: obj[key] }));
  return filter ? res.filter(filter) : res;
};

const match = (v1, v2, size) => v1.toString().slice(0, size) === v2.toString().slice(0, size);

Page({
  data: {
    // 弹窗
    showWarnConfirm:false,


    // 顶部图片
    imageSrc: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/5013995c-e91c-4700-b762-b75f3a78aafd.jpg',


    //群ID 
    id:0,
    // 群名称
    groundName:"",
    // 群人数
    groundPeopleNumber:null,

    // 群所属区域
    areaText: '',
    areaValue: [],

    provinces: areaGround,
    cities: [],

    // 日期选择器
    mode: '',
    monthVisible: false,
    month: new Date('2025/5/16').getTime(),
    monthText: '',

    // 日期范围
    start: '2025-01-01 00:00:00',
    end: '2030-09-09 12:12:12',


    // 上传群封面
    coverFileList: [],

    // 上传群二维码
    qrFileList:[]
  },

  onReady() {
    this.init();
  },

  // 定义 loadData 方法
  loadData(id) {
    console.log('[DEBUG] 开始加载数据，参数id:', id)
    
    // 示例请求逻辑
    // wx.request({
    //   url: `https://api.example.com/category/${id}`,
    //   success: (res) => {
    //     this.setData({ categoryInfo: res.data })
    //   },
    //   fail: (err) => {
    //     console.error('数据加载失败:', err)
    //   }
    // })
  },


  // 调用自定义tabbar的init函数，使页面与tabbar激活状态保持一致
  onShow() {
    this.getTabBar().init();
    const id = wx.getStorageSync('tempCategoryId')
    if (id) {
      this.loadData(id)
      wx.removeStorageSync('tempCategoryId')
    }
    console.log(id,'id');
    if(id){
      this.getDetail(id);
    }
  },

  getDetail(id){
    http({
      url: '/api/wx/group/getById',
      method: 'GET',
      data: {id:id}
    })
      .then(res => {
        console.log('获取当前群的信息:', res.data );
        if(res.code === 0){
          // 设置日期
          const date = new Date(res.data.qrcodeExpire);
          const monthText = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        // 设置群封面图片
        const coverFileList = res.data.icon ? [{
          url: res.data.icon,
          status: 'done' // 已上传状态
        }] : [];
        
        // 设置群二维码图片
        const qrFileList = res.data.qrcode ? [{
          url: res.data.qrcode,
          status: 'done' // 已上传状态
        }] : [];

          this.setData({
            groundName:res.data.groupName,
            groundPeopleNumber:res.data.peopleNum,
            monthText,
            areaText:res.data.province + ' ' + res.data.city,
            coverFileList,
            qrFileList,
            id:res.data.id
          })
        }else if(res.code === 401){
          console.log('眺望登录页');
        }

      })
      .catch(err => {
        console.error('请求失败:', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },


  init() {
    const { provinces } = this.data;
    const  cities = provinces[0].children;
    this.setData({ cities });

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


  onColumnChange(e) {
    console.log('pick:', e.detail);
    const { column, index } = e.detail;
    const { provinces, cities } = this.data;

    if (column === 0) {
      // 更改省份
      const cities = provinces[index].children;
      this.setData({ cities });
    }
  },


  getCounties(cityValue) {
    return getOptions(areaList.counties, (county) => match(county.value, cityValue, 4));
  },

  onPickerChange(e) {
    const { value, label } = e.detail;
    console.log('picker confirm:', e.detail);
    this.setData({
      areaVisible: false,
      areaValue: value,
      areaText: label.join(' '),
    });
  },

  onPickerCancel(e) {
    console.log('picker cancel', e.detail);
    this.setData({ areaVisible: false });
    if (!this.data.areaValue.length) this.init();
  },

  onAreaPicker() {
    this.setData({ areaVisible: true });
  },

  // 日期选择器
  showPicker(e) {
    const { mode } = e.currentTarget.dataset;
    this.setData({
      mode,
      [`${mode}Visible`]: true,
    });
  },

  hidePicker() {
    const { mode } = this.data;
    this.setData({
      [`${mode}Visible`]: false,
    });
  },

  onConfirm(e) {
    const { value } = e.detail;
    const { mode } = this.data;
    console.log('confirm', value);
    this.setData({
      [mode]: value,
      [`${mode}Text`]: value,
    });
    this.hidePicker();
  },



   // 统一处理文件添加
   handleAdd(e) {
    const type = e.currentTarget.dataset.type; // 获取上传类型：cover 或 qr
    const files = e.detail.files;
    const key = `${type}FileList`; // 动态键名：coverFileList 或 qrFileList

    // 更新对应的文件列表
    this.setData({
      [key]: [...this.data[key], ...files.map(file => ({
        url: file.url,
        status: 'loading', // 初始状态
        percent: 0,
      }))],
    });

    // 执行上传
    files.forEach((file, index) => this.uploadFile(file, type, index));
  },

  // 统一上传方法
  uploadFile(file, type, index) {
    const key = `${type}FileList`;
    const token = wx.getStorageSync('wechattoken'); // 从本地存储获取token
    const task = wx.uploadFile({
      url: 'https://blog.shy-info.com/api/wx/file/uploadV1',
      filePath: file.url,
      name: 'file',
      header: {
        'Authorization': `Bearer ${token}`, // 添加token到请求头
        'token':token
      },
      success: (res) => {
        try {
          // 解析返回的字符串为JSON对象
          const response = JSON.parse(res.data);
          
          if (response.code === 0) {
            this.setData({
              // 更新为服务器返回的真实URL
              [`${key}[${index}].url`]: response.data,
              [`${key}[${index}].status`]: 'done'
            });
          } else {
            this.setData({
              [`${key}[${index}].status`]: 'failed'
            });
            wx.showToast({ title: '上传失败: ' + response.msg, icon: 'none' });
          }
        } catch (error) {
          console.error('解析响应数据失败:', error);
          this.setData({
            [`${key}[${index}].status`]: 'failed'
          });
          wx.showToast({ title: '上传数据解析失败', icon: 'none' });
        }

      },
      fail: () => {
        this.setData({
          [`${key}[${index}].status`]: 'failed',
        });
      },
    });

    task.onProgressUpdate((res) => {
      this.setData({
        [`${key}[${index}].percent`]: res.progress,
      });
    });
  },

  // 统一处理文件移除
  handleRemove(e) {
    const type = e.currentTarget.dataset.type; // 获取上传类型
    const index = e.detail.index;
    const key = `${type}FileList`;
    const fileList = this.data[key];

    fileList.splice(index, 1);
    this.setData({
      [key]: fileList,
    });
  },


  onSubmit(e){

  if(!wx.getStorageSync('wechattoken')){
    this.setData({
      showWarnConfirm:true,
    })
    return;
  }

    // 获取到群名称和群人数数据
    let formValue = e.detail.value;
    // 区域数据
    let adress = this.data.areaText;
    // 过期时间
    let time = this.data.monthText;
    // 封面
    let cover = this.data.coverFileList;
    // 二维码
    let qr = this.data.qrFileList;

    // 用户信息
    let info = wx.getStorageSync('wechatUser');

    let query = {
      id: this.data.id,
      issueUser: wx.getStorageSync('userInfo').nickName,
      unionId: info.unionId,
      groupName: formValue?.groupName,
      qrcodeExpire: time?.replace(/-/g,"/"),
      peopleNum: formValue?.groundPeopleNumber,
      province: adress?.split(' ')[0],//省份
      city: adress?.split(' ')[1],//城市
      icon: cover[0]?.url,//群封面
      qrcode: qr[0]?.url//二维码
    };

    http({
      url: this.data.id === 0 ? '/api/wx/group/insert' : '/api/wx/group/update',
      method: 'POST',
      data: query
    })
      .then(res => {
        console.log('表单提交成功:', res.data );
        wx.showToast({ title: '提交内容' + res.msg, icon: res.msg === '成功' ? 'success' : 'none'});
      })
      .catch(err => {
        console.error('请求失败:', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  closeDialog(){
    this.setData({
      showWarnConfirm:false
    })
  },

  handleLogin(){
    this.setData({
      showWarnConfirm:false
    });
    wx.navigateTo({
      url: '/pages/user/login/index',
    });
  }
});