const app = getApp() // 全局APP
let store = require("../../utils/store.js")
let Api = app.Api
let router = require("../../utils/router.js")
// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: store.getItem('username'),
    company: store.getItem('company'),
    carList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarList().then(res => {
    })
  },
  searchIcon(e) {
    let key = e.detail.value.toLowerCase();
    let carList = this.data.carList;
    for (let i = 0; i < carList.length; i++) {
      let a = key;
      let b = carList[i].carNo.toLowerCase();
      if (b.search(a) != -1) {
        carList[i].isShow = true
      } else {
        carList[i].isShow = false
      }
    }
    this.setData({
      carList: carList
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
      current: e.currentTarget.dataset.url
    });
  },
  getCarList() {
    var that = this;
    var userInfo = {};
    userInfo.username = store.getItem('username');
    userInfo.company = store.getItem('company');
    //console.log(userInfo)
    return new Promise(function (resolve, reject) {
      app.get(Api.selectCar, { userInfo }).then(res => {
        console.log(res)
        that.setData({ carList: res.data.carInfo });
        resolve();
      })
    })

  },
  gotoAd() {
    router.push("addCar");
  },
  gotoUpdate(e){
    router.push({path:"update",query:e.currentTarget.dataset})
  },
  deleteCar(e) {
    let userInfo = {};
    userInfo.username = this.data.username;
    userInfo.carNo = e.currentTarget.dataset.car;
    wx.showModal({
      title: '删除',
      content: '确定要删除吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          app.get(Api.deleteCar, { userInfo }).then(res => {
            let wholePhoto = [res.data[0].wholePhoto];
           // console.log(wholePhoto);
            wx.cloud.deleteFile({fileList:wholePhoto}).then(res=>
              {
                //console.log(res)
              })
            wx.showModal({
              title: "删除成功"
            })
            wx.reLaunch({
              url: '../personal/personal',
            })
          })
        }
      }
    })

  },
  rejectCar(e) {
    let carInfo = {};
    carInfo.username = this.data.username;
    carInfo.carNo = e.currentTarget.dataset.car;
    wx.showModal({
      title: '注销',
      content: '确定要注销吗？',
      cancelText: '再看看',
      confirmText: '注销',
      success: res => {
        if (res.confirm) {
          app.get(Api.changeStatus, { carInfo }).then(res => {
           console.log(res)
            wx.showModal({
              title: "注销成功"
            })
            wx.reLaunch({
              url: '../personal/personal',
            })
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gotoAdd() {

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