var sqlMap = {
    userinfo:{
        //添加用户
        add:'insert into userinfo(username,password) values (?,?)',
        //查询用户密码
        select:'select password,"获取密码成功！"as message ,0 as code from userinfo where username=?'
    },
    carinfo:{
        //新建车辆
        add:'insert into carinfo(username,carNo,date,isShow,company,wholePhoto,status) values (?,?,?,1,?,?,"删除")',
        //显示所有车辆
        showall:'select * from carinfo where username=? and company=?',
        //删除车辆
        deleteCar:['select wholePhoto from carinfo where username=? and carNo=?',
                   'delete from carinfo where username=? and carNo=?'],
        updateCar:'update carinfo set engine=?,VIN=?,traverse=?,speedchanger=?,front=?,back=? where username=? and carNo=?',
        changeStatus:'update carinfo set status="已受理" where username=? and carNo=?',
        showDetail:'select * from carinfo where username=? and carNo=? and company=?'
        }
}
module.exports = sqlMap;