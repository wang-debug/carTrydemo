const app = getApp() // 全局APP
let store = require("../../utils/store.js")
let Api = app.Api
let router = require("../../utils/router.js")
// pages/addCar/addCar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    imgUrl:'',
    imgPath:'',
    company: store.getItem('company'),
    username: store.getItem('username'),
    carNo: '',
    picker: [0, 1, 2,3],
  },
  PickerChange(e) {
    // console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  changeCode(e){
    // console.log(e.detail)
    this.setData({
      is_code: e.detail.value
    })
  },
  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindCarNoInput: function (e) {
    this.setData({
      carNo: e.detail.value
    });
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
       console.log(res)
        this.setData({
          imgList: res.tempFilePaths
        })
        this.getUrl(res.tempFilePaths[0]);
      }
    });
  },
  scanImageInfo: function (imageData) {
    var that = this;
    console.log(111)
    const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate?access_token=`+this.data.access_token;
    //显示加载界面
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    return new Promise(function (resolve, reject) {
      wx.request({
        url: detectUrl,
        data: {
          image: imageData
        },
        method: 'POST',
        dataType: "json",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          //隐藏加载界面
          wx.hideLoading()
          resolve(res);
        },
        fail: res => {
          wx: wx.showToast({
            title: '忙碌,稍后再试',
            icon: 'none',
            mask: true,
            duration: 2000
          })
          reject(res);
        },
      })
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  selectImage: function () {
    var that = this;
    // 选择图片
    return new Promise(function (resolve, reject) {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          console.log("[选择图片]", res);
          that.setData({
            imgPath: res.tempFilePaths[0]
          })

          //获取图片数据
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0],
            encoding: "base64",
            success: resolve,
            fail: reject
          })

        },
        fail: reject
      })

    })
  },
  carNoGet()
  {
    app.get(Api.getToken,{}).then(res => {
      console.log(res)
      this.setData({access_token:res.data});
      this.selectImage().then(res => {
        console.log(res)
        this.scanImageInfo(res.data).then(res=>{
          console.log(res)
          this.setData({carNo:res.data.words_result.number})
        })
      })
    })
   
  },
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  getUrl(url){
    var that = this;
    wx.getFileSystemManager().readFile({
      filePath:url,
      encoding:'base64',
    success(res){
      //console.log(res)
     that.setData({imgUrl:res.data});
    }});
  },
  addCar() {
    var that = this;
    if (that.data.carNo.length == 3) {
      wx.showModal({
        title: '错误信息',
        content: '车牌号有误！',
        showCancel: false
      });
      return false;
    }
    if (that.data.imgList.length !== 1) {
      wx.showModal({
        title: '错误信息',
        content: '请上传整车照片',
        showCancel: false
      });
      return false;
    };
    let timestamp = (new Date()).valueOf();
    wx.cloud.uploadFile({
      cloudPath:timestamp+'.png',
      filePath:that.data.imgList[0],
      success:res =>{
        //console.log(res)
    var carInfo = {};
    var date = new Date();
    date = date.toLocaleDateString();
    carInfo.username = that.data.username;
    carInfo.wholePhoto = res.fileID;
    carInfo.company = that.data.company;
    carInfo.carNo = that.data.carNo;
    carInfo.date = date;
    carInfo.is_code = that.data.is_code;
    carInfo.plate_number = that.data.index;
    console.log(carInfo)
    app.get(Api.addCar, { carInfo }).then(res => {
      console.log(res)
      if (res.code == 0) {
        wx.showModal({
          title: '成功信息',
          content: '注册成功！',
          showCancel: false
        });
        router.push({path:"personal",query:{username:this.data.username,company:this.data.company},openType:'redirect'});
      }
      else{
        wx.showModal({
          title: '失败信息',
          content: '注册失败！',
          showCancel: true
        });
      }
    })

      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({username:options.username,company:Number(options.company)})
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