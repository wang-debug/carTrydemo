// pages/home/home.js
const app = getApp() // 全局APP
let store = require("../../utils/store.js")
let Api = app.Api
let router = require("../../utils/router.js")
Page({
  data:{
    username:'',
  },
  onLoad(e){
    console.log(e)
    this.setData({
      username:e.username
    })
  },
  gotoPersonal(){
    store.setItem('company',0);
    router.push("personal");
  },
  gotocompany(){
    store.setItem('company',1);
    router.push("personal");
  }
})