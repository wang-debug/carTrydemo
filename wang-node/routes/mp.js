let express = require('express');
let router = express.Router();
let request = require('request');
let config = require('../util/config');
let util = require('../util/util');
const sql = require('../sqlMap');
const DBHelper = require('../util/DBHelper');
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var image = require("imageinfo");

config = Object.assign({}, config.mp);

router.get('/getSession', (req, res) => {
    let code = req.query.code;
    if (!code) {
        res.json(util.handleFail('code不能为空', 10001));
    } else {
        let sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`
        request(sessionUrl, (err, response, body) => {
            let result = util.handleResponse(err, response, body);
            res.json(result);
        })
    }
})

router.get("/login", (req, res) => {
    let userInfo = JSON.parse(req.query.userInfo);
    if (!userInfo) {
        res.json(util.handleFail('用户信息不能为空', 10002));
    } else {
        // 存储数据到数据库
        let sqlStr = sql.userinfo.add;
        let conn = new DBHelper().getConn();
        conn.query(sqlStr, [userInfo.username, userInfo.password], (err, result) => {
            if (err) {
                //console.log(err)
                res.json(err);
            } else {
                res.json({
                    code: 0,
                    data: {
                        userId: '100000001'
                    },
                    message: "注册成功"
                })
            }
        });
        conn.end();

    }
})

router.get('/selectUser', (req, res) => {
    let sqlStr = sql.userinfo.select;
    let userInfo = JSON.parse(req.query.userInfo);
    console.log(userInfo)
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [userInfo.username], (err, result) => {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            result.code = 0;
            res.json(result);
        }
    });
    conn.end();
});

router.get("/addCar", (req, res) => {
    let carInfo = JSON.parse(req.query.carInfo);

    console.log(carInfo);
    if (!carInfo) {
        res.json(util.handleFail('车辆信息不能为空', 10002));
    } else {
        // 存储数据到数据库
        let sqlStr = sql.carinfo.add;
        let conn = new DBHelper().getConn();
        conn.query(sqlStr, [carInfo.username, carInfo.carNo, carInfo.date, carInfo.company, carInfo.wholePhoto], (err, result) => {
            if (err) {
                console.log(err)
                res.json(err);
            } else {
                res.json({
                    code: 0,
                    message: "添加车辆成功"
                })
            }
        });
        conn.end();

    }
});

router.get('/selectCar', (req, res) => {
    let sqlStr = sql.carinfo.showall;
    let userInfo = JSON.parse(req.query.userInfo);
    //console.log(userInfo)
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [userInfo.username, userInfo.company], (err, result) => {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            res.json({
                code: 0,
                data: {
                    carInfo: result
                },
                message: "查询成功"
            });
        }
    });
    conn.end();
});

router.get('/deleteCar', (req, res) => {
    let sqlStr = sql.carinfo.deleteCar;
    let userInfo = JSON.parse(req.query.userInfo);
    //console.log(sqlStr)
    let conn = new DBHelper().getConn();
    conn.query(sqlStr[0], [userInfo.username, userInfo.carNo], (err, res1) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                code: 0,
                data: res1,
                message: "删除成功"
            });
        }
    })
    conn.query(sqlStr[1], [userInfo.username, userInfo.carNo], (err, res2) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res2)
        }
    })

    conn.end();
});

router.get('/getToken', (req, res) => {
    var https = require('https');
    var qs = require('querystring');
    const param = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': 'AItu8raHUfugBSk8tqoAPhxx',
        'client_secret': '74FlVjYQVkIUcsSEOaZQgFtkKRW4Aihz'
    });
    var result = '';
    https.get(
        {
            hostname: 'aip.baidubce.com',
            path: '/oauth/2.0/token?' + param,
            agent: false
        },
        function (res) {
            // 在标准输出中查看运行结果
           //result = res.access_token;
            //res.pipe(process.stdout);
            res.pipe(fs.createWriteStream('./baidu-token.json'));
         
        }
    );
    var jsonFile = require('jsonfile')
var fileName = 'baidu-token.json'

jsonFile.readFile(fileName, function(err, jsonData) {
  if (err) throw err;
 
   result = jsonData.access_token;
   res.json({code:0,data:result})

});
});

router.get("/updateCar", (req, res) => {
    let carInfo = JSON.parse(req.query.carInfo);

    console.log(carInfo);
    if (!carInfo) {
        res.json(util.handleFail('车辆信息不能为空', 10002));
    } else {
        // 存储数据到数据库
        let sqlStr = sql.carinfo.updateCar;
        let conn = new DBHelper().getConn();
        conn.query(sqlStr, [carInfo.engine, carInfo.VIN, carInfo.traverse,carInfo.speedchanger, carInfo.front,carInfo.back,carInfo.username,carInfo.carNo], (err, result) => {
            if (err) {
                console.log(err)
                res.json(err);
            } else {
                res.json({
                    code: 0,
                    message: "增补信息成功"
                })
            }
        });
        conn.end();

    }
});
   
router.get("/changeStatus", (req, res) => {
    let carInfo = JSON.parse(req.query.carInfo);

    console.log(carInfo);
    if (!carInfo) {
        res.json(util.handleFail('车辆信息不能为空', 10002));
    } else {
        // 存储数据到数据库
        let sqlStr = sql.carinfo.changeStatus;
        let conn = new DBHelper().getConn();
        conn.query(sqlStr, [carInfo.username,carInfo.carNo], (err, result) => {
            if (err) {
                console.log(err)
                res.json(err);
            } else {
                res.json({
                    code: 0,
                    message: "修改状态成功"
                })
            }
        });
        conn.end();

    }
});

router.get('/showDetail', (req, res) => {
    let sqlStr = sql.carinfo.showDetail;
    let userInfo = JSON.parse(req.query.userInfo);
    //console.log(userInfo)
    let conn = new DBHelper().getConn();
    conn.query(sqlStr, [userInfo.username, userInfo.carNo,userInfo.company], (err, result) => {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            res.json({
                code: 0,
                data: {
                    carInfo: result
                },
                message: "查询成功"
            });
        }
    });
    conn.end();
});
module.exports = router;
