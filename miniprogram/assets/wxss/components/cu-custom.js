const router = require("../../../utils/router");

const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    url:{
      type: String,
      default: 'index'
    },

    bgImage: {
      type: String,
      default: ''
    },
    userinfo: {
      type: String,
      default: {}
    },
    company:{
      type: Number,
      default: 0
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      console.log(this.data)
       router.push({path:this.data.url,query:{username:this.data.userinfo,company:this.data.company},openType:'redirect'})
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})