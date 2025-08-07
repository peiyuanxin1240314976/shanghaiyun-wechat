import http from '../../../utils/http';
const { feedbackFn } = require('../../../utils/util');

Component({
  data: {
    // 下拉筛选框
    product: {
      value: '',
      options: [
        {
          value: '',
          label: '全部状态',
        },
        {
          value: '反馈失效',
          label: '反馈失效',
        },
        {
          value: '到期失效',
          label: '到期失效',
        },
        {
          value: '审核失败',
          label: '审核失败',
        }
       
      ],
    },
    sorter: {
      value: '',
      options: [
        {
          value: '',
          label: '综合推荐',
        },
        {
          value: '搜索热度从高到低',
          label: '搜索热度从高到低',
        },
        {
          value: '搜索热度从低到高',
          label: '搜索热度从低到高',
        },
        {
          value: '发布时间从小到大',
          label: '发布时间从小到大',
        },
        {
          value: '发布时间从大到小',
          label: '发布时间从大到小',
        },
        {
          value: '过期时间从近到远',
          label: '过期时间从近到远',
        },
        {
          value: '过期时间从远到近',
          label: '过期时间从远到近',
        }
      ],
    },



    // list数据
    loading: false,
    finished: false,
    noTu: '', // 默认图片路径
    list: [
    ],

    goodListPagination: {
      index: 0,
      num: 20,
    },

    privateData: {
      tabIndex: 0,
    },

  },
  methods: {
    // 获取数据
    // 获取列表数据
    fetchListData(fresh = false) {
      this.setData({
        loading: true
      });
      
      const pageSize = this.data.goodListPagination.num;
      let pageIndex = this.data.privateData.tabIndex * pageSize + this.data.goodListPagination.index + 1;

      http({
        url: '/api/wx/group/search',
        method: 'POST',
        data: { 
          page: pageIndex,
          current: pageSize,
          suggest: this.data.product.value,//综合推荐
          region: "",//区域
          peopleNum: null,
          unionId: "",
          type: this.data.sorter.value,//群类型
          groupName: ""//群名字
         }
      })
        .then(data => {
          console.log('请求成功:', data );
          data.data.records.map(el=>{
            if(!el.icon){
              el.icon = 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/dd53a1a8-24a7-4154-af4b-fd28e1e39701.png';
            };

            el.subscript = feedbackFn(el);
          })
          const nextList = data.data.records;
          this.setData({
            list: fresh ? nextList : this.data.list.concat(nextList),
            loading: false,
          });
        })
        .catch(err => {
          console.error('请求失败:', err);
          this.setData({
            loading: false
          });
          wx.showToast({ title: '加载失败', icon: 'none' });
        });
    },



    onSuggestChange(e) {
      this.setData({
        'product.value': e.detail.value,
      }, () => {
        this.fetchListData(true);
      });
    },

    onTypeChange(e) {
      this.setData({
        'sorter.value': e.detail.value,
      }, () => {
        this.fetchListData(true);
      });
    },


    // 跳转编辑
    toUrl(e) {
      const id = e.currentTarget.dataset.id;
      console.log(id);
      // debugger
      wx.setStorageSync('tempCategoryId', id)
      wx.switchTab({
        url: '/pages/category/index',
        success: () => {
          wx.removeStorageSync('tempCategoryId') // 清理缓存
        }
      })
    },
  
    onLoad() {
      this.fetchListData();
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
  },
});
