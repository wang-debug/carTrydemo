const app = getApp() // 全局APP
let store = require("../../utils/store.js")
let Api = app.Api
let router = require("../../utils/router.js")
Page({
  data: {
    userId:store.getItem("userId"),
    username: store.getItem('username'),
    password: '',
    code: '',
    loginErrorCount: 0
  },
  /**
   * 页面加载
   */
  onLoad (e) {
    if(!this.data.userId){
      this.getSession();
    }
    if(e.username && e.password)
    {
      this.setData({
        username:e.username,
        password:e.password
      })
    }
  },
  //获取登录的code
  getSession(){
    wx.login({
      success:res =>{
        if(res.code){
          app.get(Api.getSession,{
            code:res.code
          }).then(res => {
            console.log(res)
            store.setItem("openId",res.data.openid);
          }).catch(err =>{
            console.log(err)
          })
        }
      }
    })
  },
  getUserInfo(){
    let userInfo = {username:this.data.username};
    console.log(userInfo)
    app.get(Api.selectUser,{userInfo}).then(res => {
      console.log(res)
      if(res.length == 0)
      {
        wx.showToast({
          title: "用户名不存在！",
          icon: 'none',
          duration: 2000,
          mask: false,
        });
        return;
      }
      if(this.data.password == res[0].password)
      {
        wx.showToast({
            title: "登录成功！",
            icon: 'none',
            duration: 2000,
            mask: false,
          });
          store.setItem('username',this.data.username)
        router.push({path:"home",query:userInfo});
      }
      else{
        wx.showToast({
        title: "密码不正确！",
        icon: 'none',
        duration: 2000,
        mask: false,
      });
      }
      // store.setItem('userId',res.data.userId);
      // this.setData({
      //   userId:res.data.userId
      // })
      // wx.showToast({
      //   title: res.message,
      //   icon: 'none',
      //   duration: 2000,
      //   mask: false,
      // });
    })
  },
  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function (e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindCodeInput: function (e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }

})
