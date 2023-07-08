const db = require('../config/db.js');

function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}


/**
 * id,pw값을 받아 db에 검색 후 계정 존재하면 마지막 로그인 시각 업데이트 후 결과값 리턴
 * @param {*} id 
 * @param {*} pw 
 * @returns 
 */
module.exports.login = async (id, pw) => {
    let result = await db.Query('SELECT user_num,user_name FROM User WHERE user_id=? AND password=?', [id, pw]);
    
    if (result.length != 0) { // 결과 존재
        let { user_num:userNum, user_name:userName } = result[0];
        let timestamp = new Date().getTime();
        let currentDate = new Date(timestamp);
        let currentFormatDate = dateFormat(currentDate);
        await db.Query('INSERT Login_history SET?', { user_num: userNum, login_date: currentFormatDate });
        await db.Query('UPDATE User SET last_login_date=? WHERE user_id= ?', [currentFormatDate, id]); // 마지막 로그인 시각 업데이트
        console.log('user: ', id + ' - login success');
        return { result: true, msg: '로그인에 성공했습니다.', user: { id: id, name: userName }, userNum: userNum };
    } else { //결과 없음
        console.log('user: ', id + ' - login fail: No such ID or PW');
        return { result: false, msg: '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }
}