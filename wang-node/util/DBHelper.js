const mysql = require('mysql');

class DBHelper{
    getConn(){
        let conn = mysql.createConnection({
            host:'localhost',
            port:'3306',
            user:'root',
            password:'',
            database:'car'
        });
        conn.connect();
        return conn;
    }
}

module.exports = DBHelper;