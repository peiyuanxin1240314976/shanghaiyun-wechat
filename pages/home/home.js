
import Toast from 'tdesign-miniprogram/toast/index';
import { areaGround } from '../../utils/area';
import http from '../../utils/http';
import http2 from '../../utils/http2';


// 综合推荐
const filterBtn1 = [
  {
    label:'综合推荐',
    value:''
  },
  {
    label:'热度从高到低',
    value:'热度从高到低'
  },
  {
    label:'热度从低到高',
    value:'热度从低到高'
  },
  {
    label:'人数从高到低',
    value:'人数从高到低'
  },
  {
    label:'人数从低到高',
    value:'人数从低到高'
  }
];
const filterBtn2 = [
  { label: "综合推荐", value: "" },
  { label: "车抵", value: "车抵" },
  { label: "房抵", value: "房抵" },
  { label: "消费贷", value: "消费贷" },
  { label: "税票贷", value: "税票贷" },
  { label: "商户贷", value: "商户贷" },
  { label: "融资租赁", value: "融资租赁" },
  { label: "债务重组", value: "债务重组" }
];



Page({
  data: {
    showWebView1:false,//是否显示第三方网站
    showWebView2:false,//是否显示第三方网站
    showWebView3:false,//是否显示第三方网站
    webViewUrl:"",
    // swiper数据
    imgSrcs: [],
    // tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },

    // 通知数据
    noticeSwitch:true,
    marquee:{
      speed: 60,
      loop: -1,
      delay: 0,
    },
    noticeContent:"",

    // 第三方跳转
    imageSrc: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/2b152810-6843-4431-8d2b-6ff67baff701.png',
    imageSrc2: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/d871c42c-cc7d-44fe-9b20-688970cbfae3.png',
    imageSrc3: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/ded20d1f-3e09-4258-afe0-55a481e0f82d.png',


    // 综合推荐
    multipleSelect: {
      value: ['综合推荐'],
      options: filterBtn1,
    },

    tripleColumnsOptions:{
      value: ['全部'],
      options:filterBtn2
    },
    // 综合推荐
    suggest:"",
    // 群类型
    type:"",

     //群区域 
    areaValue: [],
    areaText: '',
    provinces: areaGround,
    cities: [],

   // 关闭弹窗的icon
    closeIcon:'close',

    // 群弹窗数据
    groupName:"",
    qrcode:"",
    city:"",
    peopleNum:"",
    groundId:null,
    isGetToken:"",//是不是登录了

    searchValue:"",
  },

  // onReady() {
  //   this.init();
  // },
  // init() {
  //   debugger
  //   const { provinces } = this.data;
  //   const cities = provinces[0].children;
  //   this.setData({ cities });
  // },

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


  onPickerChange(e) {
    const { value, label } = e.detail;
    console.log('picker confirm:', e.detail);
    this.setData({
      areaVisible: false,
      areaValue: value,
      areaText: label.join(' '),
    });

    this.loadGoodsList(true);
    
    const areaDropdownItem = this.selectComponent('#areaDropdownItem');
    // 关闭Dropdown
    areaDropdownItem.closeDropdown();

  },

  onPickerCancel(e) {
    console.log('picker cancel', e.detail);
    this.setData({
      areaVisible: false,
      areaValue: '',
      areaText: '',
    });
    
    this.loadGoodsList(true);

    const areaDropdownItem = this.selectComponent('#areaDropdownItem');
    // 关闭Dropdown
    areaDropdownItem.closeDropdown();
    if (this.data.areaValue.length) return;
    this.init();
  },

  onAreaPicker(e) {
    console.log(e);
    this.setData({ areaVisible: true });
  },
  closeAreaPicker(e){
    this.setData({ areaVisible: false });
  },












  
   handleMultipleSelect(e) {
      this.setData({
        'multipleSelect.value': e.detail.value,
      });
    },

    // open(e){
    //   console.log(e,'open');
    // },






  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
    this.getToken();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
    const { provinces } = this.data;
    const cities = provinces[0].children;
    let token = wx.getStorageSync('wechattoken');
        // 获取搜索记录
    let searchInfo = wx.getStorageSync('weChatSearchInfo')
    this.setData({ cities,isGetToken:token,searchValue:searchInfo });

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


  getToken(){
    let token = wx.getStorageSync('wechattoken');
    // 获取搜索记录
    let searchInfo = wx.getStorageSync('weChatSearchInfo');
    this.setData({ isGetToken:token,searchValue:searchInfo });
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
     // 调用封装的接口
     http({
      url: '/api/wx/home/getConfig',
      method: 'GET',
      data: { type: '页面设置' }
    })
      .then(data => {
        console.log('请求成功:', JSON.parse(data.data) );
        let configdata = JSON.parse(data.data);
        let swiperList = configdata.bannerImages.map(el=>el.imageUrl);
        this.setData({
          // tabList,
          imgSrcs: swiperList,
          noticeSwitch:configdata.noticeSwitch,
          noticeContent:configdata.noticeContent,
          pageLoading: false,
        });

        this.loadGoodsList(true);
      })
      .catch(err => {
        console.error('请求失败:', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });

  },

  // 选择综合排序
  onMultipleChange(e){
    console.log(e.detail);
    this.setData({ suggest:e.detail.value });
    console.log(this.data.suggest,'suggest');
    this.loadGoodsList(true);
  },

  // 群类型
  onGroundChange(e){
    this.setData({ type:e.detail.value });
    this.loadGoodsList(true);
  },

  // tabChangeHandle(e) {
  //   this.privateData.tabIndex = e.detail;
  //   this.loadGoodsList(true);
  // },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.goodListPagination.num;
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 0;
    }

    try {
      
     // 调用封装的接口
     http({
      url: '/api/wx/home/search',
      method: 'POST',
      data: { 
        page: pageIndex,
        current: pageSize,
        suggest: this.data.suggest,//综合推荐
        region: this.data.areaValue.length === 0 ? '' : this.data.areaValue[0] + this.data.areaValue[1],//区域
        peopleNum: null,
        unionId: "",
        type: this.data.type,//群类型
        groupName: this.data.searchValue//群名字
       }
    })
      .then(data => {
        console.log('请求成功:', data );
        data.data.records.map(el=>{
          if(!el.icon){
            el.icon = 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/dd53a1a8-24a7-4154-af4b-fd28e1e39701.png';
          }
        })
        const nextList = data.data.records;
        this.setData({
          goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
          goodsListLoadStatus: 0,
        });
      })
      .catch(err => {
        console.error('请求失败:', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });



      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      this.setData({ goodsListLoadStatus: 3 });
    }
  },

  // goodListClickHandle(e) {
  //   const { index } = e.detail;
  //   const { spuId } = this.data.goodsList[index];
  //   wx.navigateTo({
  //     url: `/pages/goods/details/index?spuId=${spuId}`,
  //   });
  // },

  // 打开加群弹窗
  goodListAddGroundHandle(e) {
    // console.log(e,'this');
    const { index } = e.detail;
    const good = this.data.goodsList[index];
    http({
      url: '/api/wx/group/join',
      method: 'POST',
      data: { id: good.id }
     }).then(res=>{
      if(res.code === 0){
        this.setData({
          visible: true,
          groupName:good.groupName,
          qrcode:good.qrcode,
          city:good.province + good.city,
          peopleNum:good.peopleNum,
          groundId:good.id
         });
      }else if (res.code === 401){
        console.log('我是401');
      }else{
        Toast({
          context: this,
          selector: '#t-toast',
          message: res.msg
        });
      }
     })

    console.log(good);


    // Toast({
    //   context: this,
    //   selector: '#t-toast',
    //   message: '加群',
    // });
  },

  feedback(e){
    http({
      url: '/api/wx/group/feedback',
      method: 'GET',
      data: { groupId: this.data.groundId,content:e.detail._relatedInfo.anchorTargetText }
    }).then(res=>{
      // console.log(res);
          Toast({
          context: this,
          selector: '#t-toast',
          message: e.detail._relatedInfo.anchorTargetText + '反馈' + res.msg,
          });
    })
    console.log(e.detail._relatedInfo);
  },

  // 关闭加群弹窗
  onClose(e){
      this.setData({ visible:false });
  },

  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },

  navToSearchPage() {
    wx.setStorageSync('weChatSearchInfo','');
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },


  // 跳转登录页面
  // toLogin(){
  //   wx.navigateTo({
  //     url: '/pages/user/login/index',
  //   })
  // }

// 编码 redirect_uri 参数的函数
// encodeRedirectUri(originalUrl) {
//   // 手动解析 URL 参数
//   const queryIndex = originalUrl.indexOf('?');
//   if (queryIndex === -1) return originalUrl;

//   const baseUrl = originalUrl.substring(0, queryIndex);
//   const queryStr = originalUrl.substring(queryIndex + 1);
//   const params = queryStr.split('&');

//   // 处理参数
//   let newParams = [];
//   for (const param of params) {
//     const [key, value] = param.split('=');
//     if (key === 'redirect_uri') {
//       newParams.push(`${key}=${encodeURIComponent(decodeURIComponent(value))}`);
//     } else {
//       newParams.push(param);
//     }
//   }

//   return `${baseUrl}?${newParams.join('&')}`;
// },

encodeRedirectUri(originalUrl) {
  const queryIndex = originalUrl.indexOf('?');
  if (queryIndex === -1) return originalUrl;

  const baseUrl = originalUrl.substring(0, queryIndex);
  const queryStr = originalUrl.substring(queryIndex + 1);
  const params = queryStr.split('&');

  let newParams = [];
  for (const param of params) {
    const equalIndex = param.indexOf('=');
    if (equalIndex === -1) {
      newParams.push(param);
      continue;
    }

    const key = param.substring(0, equalIndex);
    const value = param.substring(equalIndex + 1);

    if (key === 'redirect_uri') {
      newParams.push(`${key}=${encodeURIComponent(decodeURIComponent(value))}`);
    } else {
      newParams.push(param);
    }
  }
  return `${baseUrl}?${newParams.join('&')}`;
},

convertAuthUrlToMiniProgramParams(authUrl) {
  // 移除 https://open.weixin.qq.com/connect/oauth2/authorize? 前缀
  const prefixToRemove = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
  if (!authUrl.startsWith(prefixToRemove)) {
    return '';
  }
  
  const paramsStr = authUrl.substring(prefixToRemove.length);
  const params = paramsStr.split('&');
  
  let processedParams = [];
  for (const param of params) {
    const equalIndex = param.indexOf('=');
    if (equalIndex === -1) {
      processedParams.push(param);
      continue;
    }
    
    const key = param.substring(0, equalIndex);
    const value = param.substring(equalIndex + 1);
    
    if (key === 'redirect_uri') {
      // 对 redirect_uri 进行URL编码
      processedParams.push(`${key}=${encodeURIComponent(decodeURIComponent(value))}`);
    } else {
      processedParams.push(param);
    }
  }
  
  return `pages/home/home?${processedParams.join('&')}`;
},


  // 跳转登录页面
  toUrl(e){
    console.log(e.currentTarget.dataset.name);
    let apiUrl = "";
    switch (e.currentTarget.dataset.name) {
      case '烛龙指数':
        apiUrl = '/api/sso/authorize?redirect_uri=https%3A%2F%2Fh5.cloud2.shy-info.com%2F%3Fproduct-type%3Dzl-index%23%2Fpages%2Findex'
        break;
      case '关键联系人':
        apiUrl = '/api/sso/authorize?redirect_uri=https%3A%2F%2Fh5.cloud2.shy-info.com%2F%3Fproduct-type%3Dmatch%23%2Fpages%2Findex'
        break;
      case '营销意向':
        apiUrl = '/api/sso/authorize?redirect_uri=https%3A%2F%2Fh5.cloud2.shy-info.com%2F%3Fproduct-type%3Dclue%23%2Fpages%2Findex'
        break;

      default:
        break;
    }
     // 调用封装的接口
     http2({
      url: apiUrl,
      method: 'GET'
    })
      .then(res => {
        if(e.currentTarget.dataset.name === '烛龙指数'){
          this.setData({
            showWebView1:true,
            webViewUrl:this.encodeRedirectUri(res.data.authorizationUrl)  
            // webViewUrl:'https://blog.shy-info.com/home'

          })
        }else if(e.currentTarget.dataset.name === '关键联系人'){
          console.log(this.encodeRedirectUri(res.data.authorizationUrl) );
          const dynamicPath = this.convertAuthUrlToMiniProgramParams(res.data.authorizationUrl);
          wx.navigateToMiniProgram({
            appId: 'wxca91dfb8058b0cd5',
            path: dynamicPath,
            success: function(res) {
              console.log('跳转成功');
            },
            fail: function(res) {
              console.log('跳转失败', res);
            }
          });
        }else{
          this.setData({
            showWebView3:true,
            webViewUrl:this.encodeRedirectUri(res.data.authorizationUrl) 
          })
        }
        // this.setData({
        
        //   webViewUrl:encodeURI(res.data.authorizationUrl) 
        // })
      })
      .catch(err => {
        console.error('请求失败:', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      });

  },

  // 接收H5消息
  onMessage(e) {
    console.log(e,'接收到消息了吗');
    const messageData = e.detail.data; 
    if (messageData && messageData.length > 0) {
      const msg = messageData[0];
      if (msg.uuid === 'home') {
        wx.navigateBack({
          delta: 1,
          success: () => console.log("返回成功"),
          fail: (err) => console.error("返回失败:", err)
        });
      }
    }
  }
  
});
