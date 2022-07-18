// pages/home/home.js
const app = getApp() // 全局APP
let store = require("../../utils/store.js")
let Api = app.Api
let router = require("../../utils/router.js")
Page({
  data:{
    username:store.getItem('username'),
  },
  onLoad(e){
    console.log(e)
    this.setData({
      username:e.username
    })
    if(store.getItem('username'))
    {
      this.setData({
        username:store.getItem('username')
      })
    }
  },
  gotoPersonal(){
    let userinfo={}
    userinfo.username=this.data.username;
    userinfo.company=0;
    //console.log(userinfo)
    store.setItem('company',0);
    router.push({path:"personal",query:userinfo,openType:'redirect'});
  },
  gotoCompany(){
    let userinfo={}
    userinfo.username=this.data.username;
    userinfo.company=1;
    store.setItem('company',1);
    router.push({path:"personal",query:userinfo,openType:'redirect'});
  }
})