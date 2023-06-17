const db = require('../config/db.js');

/**
 * id,pw값을 받아 db에 검색 후 계정 존재하면 마지막 로그인 시각 업데이트 후 결과값 리턴
 * @param {*} id 
 * @param {*} pw 
 * @returns 
 */
module.exports.login = async (id, pw) => {
    let result = await db.Query('SELECT user_name FROM User WHERE user_id=? AND password=?', [id, pw]);
    if (result.length != 0) { // 결과 존재
        await db.Query('UPDATE User SET last_login_date=NOW() WHERE user_id= ?', [id]); // 마지막 로그인 시각 업데이트
        console.log('user: ', id + ' - login success');
        return { result: true, msg: '로그인에 성공했습니다.',user:{id:id, name:result[0].user_name} };
    } else { //결과 없음
        console.log('user: ', id + ' - login fail: No such ID or PW');
        return { result: false, msg: '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }
}