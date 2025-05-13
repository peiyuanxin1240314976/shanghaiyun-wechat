import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';






const chineseNumber = '一二三四五六七八九十'.split('');

const singleSelectOptions = new Array(8).fill(null).map((_, i) => ({
  label: `选项${chineseNumber[i]}`,
  value: `option_${i + 1}`,
  disabled: false,
}));

singleSelectOptions.push({
  label: '禁用选项',
  value: 'disabled',
  disabled: true,
});

const doubleColumnsOptions = [
  ...singleSelectOptions,
  {
    label: '禁用选项',
    value: 'disabled',
    disabled: true,
  },
];

const tripleColumnsOptions = [
  ...doubleColumnsOptions,
  {
    label: '禁用选项',
    value: 'disabled',
    disabled: true,
  },
];

tripleColumnsOptions.splice(8, 0, {
  label: `选项${chineseNumber[8]}`,
  value: `option_${9}`,
  disabled: false,
});









const areaList = {
  provinces: {
    110000: '北京市',
    440000: '广东省',
  },
  cities: {
    110100: '北京市',
    440100: '广州市',
    440200: '韶关市',
    440300: '深圳市',
    440400: '珠海市',
    440500: '汕头市',
    440600: '佛山市',
  },
  counties: {
    110101: '东城区',
    110102: '西城区',
    110105: '朝阳区',
    110106: '丰台区',
    110107: '石景山区',
    110108: '海淀区',
    110109: '门头沟区',
    110111: '房山区',
    110112: '通州区',
    110113: '顺义区',
    110114: '昌平区',
    110115: '大兴区',
    110116: '怀柔区',
    110117: '平谷区',
    110118: '密云区',
    110119: '延庆区',
    440103: '荔湾区',
    440104: '越秀区',
    440105: '海珠区',
    440106: '天河区',
    440111: '白云区',
    440112: '黄埔区',
    440113: '番禺区',
    440114: '花都区',
    440115: '南沙区',
    440117: '从化区',
    440118: '增城区',
    440203: '武江区',
    440204: '浈江区',
    440205: '曲江区',
    440222: '始兴县',
    440224: '仁化县',
    440229: '翁源县',
    440232: '乳源瑶族自治县',
    440233: '新丰县',
    440281: '乐昌市',
    440282: '南雄市',
    440303: '罗湖区',
    440304: '福田区',
    440305: '南山区',
    440306: '宝安区',
    440307: '龙岗区',
    440308: '盐田区',
    440309: '龙华区',
    440310: '坪山区',
    440311: '光明区',
    440402: '香洲区',
    440403: '斗门区',
    440404: '金湾区',
    440507: '龙湖区',
    440511: '金平区',
    440512: '濠江区',
    440513: '潮阳区',
    440514: '潮南区',
    440515: '澄海区',
    440523: '南澳县',
    440604: '禅城区',
    440605: '南海区',
    440606: '顺德区',
    440607: '三水区',
    440608: '高明区',
  },
};

const getOptions = (obj, filter) => {
  const res = Object.keys(obj).map((key) => ({ value: key, label: obj[key] }));

  if (filter) {
    return res.filter(filter);
  }

  return res;
};

const match = (v1, v2, size) => v1.toString().slice(0, size) === v2.toString().slice(0, size);




Page({
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },

    // 第三方跳转
    imageSrc: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/2b152810-6843-4431-8d2b-6ff67baff701.png',
    imageSrc2: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/d871c42c-cc7d-44fe-9b20-688970cbfae3.png',
    imageSrc3: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/ded20d1f-3e09-4258-afe0-55a481e0f82d.png',



    multipleSelect: {
      value: ['option_1'],
      options: singleSelectOptions,
    },
    doubleColumnsOptions,
    tripleColumnsOptions,





    areaText: '',
    areaValue: [],
    provinces: getOptions(areaList.provinces),
    cities: [],
    counties: [],

// 关闭弹窗的icon
    closeIcon:'close',
  },

  lifetimes: {
    ready() {
      this.init();
    },
  },
  init() {
    const { provinces } = this.data;
    const { cities, counties } = this.getCities(provinces[0].value);

    this.setData({ cities, counties });
  },

  onColumnChange(e) {
    console.log('pick:', e.detail);
    const { column, index } = e.detail;
    const { provinces, cities } = this.data;

    if (column === 0) {
      // 更改省份
      const { cities, counties } = this.getCities(provinces[index].value);

      this.setData({ cities, counties });
    }

    if (column === 1) {
      // 更改城市
      const counties = this.getCounties(cities[index].value);

      this.setData({ counties });
    }

    if (column === 2) {
      // 更改区县
    }
  },

  getCities(provinceValue) {
    const cities = getOptions(areaList.cities, (city) => match(city.value, provinceValue, 2));
    const counties = this.getCounties(cities[0].value);

    return { cities, counties };
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
    this.setData({
      areaVisible: false,
    });

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
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    fetchHome().then(({ swiper, tabList }) => {
      this.setData({
        tabList,
        imgSrcs: swiper,
        pageLoading: false,
      });
      this.loadGoodsList(true);
    });
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
      const nextList = await fetchGoodsList(pageIndex, pageSize);
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: 0,
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
    const { spuId } = this.data.goodsList[index];
    // console.log(spuId);
    this.setData({ visible: true });
    // Toast({
    //   context: this,
    //   selector: '#t-toast',
    //   message: '加群',
    // });
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
 console.log('11');
  },

  navToActivityDetail({ detail }) {
    const { index: promotionID = 0 } = detail || {};
  },
});
