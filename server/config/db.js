const mysql = require('mysql2/promise');
const secret =require('./secretNew');


// MySQL 연결 설정
const db = mysql.createPool({
    host: '127.0.0.1',
    user: secret.db.DB_USER,
    password: secret.db.DB_PASSWORD,
    database: secret.db.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    port:'3306'
});

/**
 * db pool 연결해서 쿼리 실행 후 pool return, 쿼리 결과값을 리턴
 * @param {*} sql query sentence
 * @param {*} param query param
 * @returns 
 */
module.exports.Query = async (sql, param) =>{
    let conn = await db.getConnection();
  
  //구조분해할당, query 는 select 결과, 필드정보 가 [ [] , [] ] 형태로 반환되므로 구조분해할당 으로
  //결과에 해당하는 [] 만 받으려면 [result] 로 할당 받는다
  let [result] = await conn.query(sql, param);

  conn.release()
  
  return result;
  }

  module.exports.pool=db;