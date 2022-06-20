// pages/update/update.js
const app = getApp() // 全局APP
let store = require("../../utils/store.js")
let Api = app.Api
let router = require("../../utils/router.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: store.getItem('company'),
    username: store.getItem('username'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ carNo: options.carno })
    this.getCarList().then(res=>{
      console.log(res)
      this.setData({
        imgList:[{ title: "发动机照",url:res.engine}, { title: "车架照" ,url:res.VIN}, { title: "方向机照" ,url:res.traverse}, { title: "变速器照",url:res.speedchanger ,url:res.speedchanger}, { title: "前桥照" ,url:res.front}, { title: "后桥照",url:res.back }]
      })
    })
  },
  ChooseImage(e) {
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    let str = 'imgList[' + index + '].url'
    wx.chooseImage({
      count: 6, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {

        this.setData({
          [str]: res.tempFilePaths[0]
        })
      }
    });
  },
  ViewImage(e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    let index = e.currentTarget.dataset.index;
    let str = 'imgList[' + index + '].url'
    wx.showModal({
      title: '删除',
      content: '确定要删除吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.setData({
            [str]: null
          })
        }
      }
    })
  },
  uploadImage() {
    var that = this;
    let PromiseArr = [];
    for (let i = 0; i < 6; i++) {
      let str = 'imgList[' + i + '].url'
      if (that.data.imgList[i].url) {
        PromiseArr.push(new Promise(function (resolve, reject) {
          let timestamp = (new Date()).valueOf();
          wx.cloud.uploadFile({
            cloudPath: timestamp + '.png',
            filePath: that.data.imgList[i].url,
            success: res => {
              console.log(res)
              that.setData({
                [str]: res.fileID
              })
              resolve(res.fileID);
            }
          })
        }))
      }
    }

    return Promise.all(PromiseArr).then(function (values) {
      //console.log(values);
      var carInfo = {}
      //console.log(that.data.imgList);
      carInfo.username = that.data.username;
      carInfo.carNo = that.data.carNo;
      carInfo.engine = that.data.imgList[0].url;
      carInfo.VIN = that.data.imgList[1].url;
      carInfo.traverse = that.data.imgList[2].url;
      carInfo.speedchanger = that.data.imgList[3].url;
      carInfo.front = that.data.imgList[4].url;
      carInfo.back = that.data.imgList[5].url;
      console.log(carInfo)
      app.get(Api.updateCar, { carInfo }).then(res => {
        console.log(res)
        wx.showModal({
          title: '成功信息',
          content: res.message,
          showCancel: false
        });
        router
      })
    }).catch(err => {
      console.log(err)
    })
  },
  updateCar() {
    var carInfo = {};
    this.uploadImage();
  },
  getCarList() {
    var that = this;
    var userInfo = {};
    userInfo.username = store.getItem('username');
    userInfo.company = store.getItem('company');
    userInfo.carNo = this.data.carNo;
    console.log(userInfo)
    return new Promise(function (resolve, reject) {
      app.get(Api.showDetail, { userInfo }).then(res => {
        console.log(res)
        resolve(res.data.carInfo[0]);
      })
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})