//路由跳转
//映射
const routerPath = {
    "index": "/pages/index/index",
    "home":"/pages/home/home",
    "personal":"/pages/personal/personal",
    "company":"/pages/company/company",
    "addCar":"/pages/addCar/addCar",
    "update":"/pages/update/update",
    "register":"/pages/register/register"
}

module.exports = {
    //this.$router.push("",(path:"",query))
    push(path, option = {}) {
        if (typeof path === 'string') {
            option.path = path;
        } else {
            option = path;
        }
       
        //获取url
        let url = routerPath[option.path];
         
        let { query = {}, openType } = option;
        let params = this.parse(query);  //将object转换为url
        if(params){
            url+='?'+params;
        }
        this.to(openType,url);
    },
    to(openType,url)
    {
        let obj = { url }
        if(openType === 'redirect'){
            wx.redirectTo(obj);
        }else if(openType === 'reLauch'){
            wx.reLaunch(obj);
        }else if(openType === 'back'){
            wx.navigateBack({
                delta:1
            })
        }else{
            wx.navigateTo(obj);
        }
    },
    parse(data) {
        let arr = [];
        for (let key in data) {
            arr.push(key + '=' + data[key]);
        }
        return arr.join("&");
    }
}