//网络请求的公共方法
//基本请求；后续获取数据方便 promise
//对获取数据的状态处理
//对请求头的处理
let store = require("../utils/store.js")
let system = store.getSystemInfo();

const clientInfo = {
    'clientType': "mp",
    "appnm": "",
    "model": system.model,
    "os": system.system,
    "screen": system.screenWidth + "*" + system.screenHegiht,
    "version": App.version,
    "chennel": "miniprogram"

}
module.exports = {
    fetch: (url, data = {}, option = {}) => {
        let { loading = true, toast = true, method = 'get' } = option;
        if(loading){
            wx.showLoading({
                title: "加载中",
                mask: true,
            });
        }
        return new Promise((resolve, reject) => {
            let env = App.config.baseApi;
            wx.request({
                url: env + url,
                data,
                method,
                header: {
                    "clientInfo": JSON.stringify(clientInfo)
                },
                success: function (result) {
                    //wx.hideLoading();
                   // console.log(result)
                    let res = result.data;
                    if (result.statusCode == 200) {
                        if(loading){
                            wx.hideLoading();
                        }
                        resolve(result.data)
                    }else{
                        if(toast){
                            console.log(res)
                            // wx.showToast({
                            //     mask:true,
                            //     title:res[0].message,
                            //     icon:"none"
                            // })
                        }
                            wx.hideLoading();}
                        
                    
                },
                fail:function(e = {code:-1,msg:errMsg}){
                    let msg = e.errMsg;
                    if(msg == "request:fail timeout"){
                        msg = '请求超时，请稍后处理'
                    }
                    wx.showToast({
                        title:msg,
                        icon:"none"
                    })
                    reject(e);
                }
            })
        })
    }
}