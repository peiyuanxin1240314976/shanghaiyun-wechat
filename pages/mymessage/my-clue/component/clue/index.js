import http from '../../../../../utils/http';
import Toast from 'tdesign-miniprogram/toast/index';

Component({
  properties: {
    cluevalue: {
      type: Array,
      value: [],
      observer: function(newVal) { // 添加监听器
        console.log('[DEBUG] 收到父组件数据:')
      }
    },
  },
  data: {
    areaValue:"",
    icon:'https://blog-1325333133.cos.ap-guangzhou.myqcloud.com/admin/1/9cf7637d-9a16-491a-8f03-2af412b1d0c9.png',
    // 关闭弹窗的icon
    closeIcon:'close',
    // 弹窗需要的值
    cur: {},

    arealist:[
      {
        id:1,
        name:'号码准确',
      },
      {
        id:2,
        name:'空号',
      },
      {
        id:3,
        name:'无人接听',
      },
      {
        id:4,
        name:'号码错误',
      },
    ],
    activeAreaId: null,
  },

  methods:{
    flowUp(e){
      const index = e.currentTarget.dataset.index
      const item = this.properties.cluevalue[index]
      this.setData(
        {
          cur: item,
        },
        () => {
          this.setData({ visible: true });
        },
      );
    },
  
    onVisibleChange(e) {
      this.setData({
        visible: e.detail.visible,
      });
    },
  
    onClose(e){
      this.setData({
        visible: false,
      });
    },
  
    choseBtn(e){
      this.setData({
         activeAreaId:e.currentTarget.dataset.id ,
         areaValue:e.currentTarget.dataset.item
        });
    },

    changeInput(e){
      this.setData({
        areaValue:e.detail.value
       });
    },


    onSubmitFeedBack(){
      console.log(this.data.areaValue);
      http({
        url: '/api/wx/user/updateClue',
        method: 'POST',
        data: { ...this.data.cur ,feedbackContent:this.data.areaValue}
      })
        .then(res => {
          if(res.code === 0){
            Toast({
              context: this,
              selector: '#t-toast',
              message: '提交成功',
            });
            this.setData({
              visible: false,
            });
          }else if(res.code === 401){
            console.log('跳转登录');
          }
        })
        .catch(err => {
          console.error('请求失败:', err);
          wx.showToast({ title: '加载失败', icon: 'none' });
        });
    },

    callPhone(){
      wx.makePhoneCall({
        phoneNumber: this.data.cur.contactNumber, //电话号码
        success:function(){
          console.log('请求成功');
        },
        fail:function(err){
          console.error('请求失败:', err);
        }
      })
    }
  }


})