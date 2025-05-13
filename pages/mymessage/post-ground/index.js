Component({
  data: {
    // 下拉筛选框
    product: {
      value: '全部状态',
      options: [
        {
          value: '全部状态',
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
      value: '综合推荐',
      options: [
        {
          value: '综合推荐',
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
    icon:'/static/image/1.png',
    loading: false,
    finished: false,
    noTu: '', // 默认图片路径
    list: [
      {
        id: 1,
        groupName: '深圳技术交流群',
        issueTime: '2023-05-10',
        qrcodeExpire: '2023-06-10',
        click: 350,
        province: '广东省',
        city: '深圳市',
        icon: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/31ecb44c-240b-4a94-942e-7a5baf66ed73.png',
        feedbackStatus: 1
      },
      {
        id: 2,
        groupName: '北京产品经理群',
        issueTime: '2023-05-12',
        qrcodeExpire: '2023-06-12',
        click: 280,
        province: '北京市',
        city: '',
        icon: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/31ecb44c-240b-4a94-942e-7a5baf66ed73.png',
        feedbackStatus: 2
      },
      {
        id: 3,
        groupName: '上海设计师交流',
        issueTime: '2023-05-15',
        qrcodeExpire: '2023-06-15',
        click: 420,
        province: '上海市',
        city: '',
        icon: 'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/31ecb44c-240b-4a94-942e-7a5baf66ed73.png',
        feedbackStatus: 0
      }
    ]
  },
  methods: {
    onChange(e) {
      this.setData({
        'product.value': e.detail.value,
      });
    },




    feedbackFn(item) {
      // 根据 feedbackStatus 返回不同的图标
      const statusMap = {
        1: '/static/image/1.png',
        2: '/static/image/2.png',
        0: '/static/image/3.png'
      };
      console.log(statusMap,item);
      return statusMap[item.feedbackStatus] || '';
    },
  
    toUrl(e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/edit/edit?id=${id}`
      });
    },
  
    onLoad() {
      // 模拟加载更多数据
      setTimeout(() => {
        this.setData({
          loading: false,
          finished: true // 这里设为true表示没有更多数据
        });
      }, 1000);
    }
  },
});
