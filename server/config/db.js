const mysql = require('mysql');
const secret =require('./secret');


// MySQL 연결 설정
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: secret.db.DB_USER,
    password: secret.db.DB_PASSWORD,
    database: secret.db.DB_DATABASE,
    port:'3306'
});
  
// MySQL 연결
db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('MySQL connected...');
});


module.exports=db;
