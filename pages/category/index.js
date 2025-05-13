
import areaList from './area';
const getOptions = (obj, filter) => {
  const res = Object.keys(obj).map((key) => ({ value: key, label: obj[key] }));
  return filter ? res.filter(filter) : res;
};

const match = (v1, v2, size) => v1.toString().slice(0, size) === v2.toString().slice(0, size);

Page({
  data: {
    // 顶部图片
    imageSrc: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/5013995c-e91c-4700-b762-b75f3a78aafd.jpg',


    areaText: '',
    areaValue: [],
    provinces: getOptions(areaList.provinces),
    cities: [],
    counties: [],

    // 日期选择器
    mode: '',
    monthVisible: false,
    month: '2021-09',
    monthText: '',

    // 日期范围
    start: '2000-01-01 00:00:00',
    end: '2030-09-09 12:12:12',


    // 上传群封面
    coverFileList: [],

    // 上传群二维码
    qrFileList:[]
  },

  onReady() {
    this.init();
  },

  // 调用自定义tabbar的init函数，使页面与tabbar激活状态保持一致
  onShow() {
    this.getTabBar().init();
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
    const task = wx.uploadFile({
      url: 'https://your-api.com/upload',
      filePath: file.url,
      name: 'file',
      success: () => {
        this.setData({
          [`${key}[${index}].status`]: 'done',
        });
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

});