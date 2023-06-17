const db = require('../config/db.js');
const emailAuth = require('./emailAuth.js');



/**
 * post(/signup)요청 처리 : db에 인증대기 회원으로 등록 후 인증메일 전송
 * @param {*} user 
 * @returns {*} 
 */
module.exports.signup = async (user) => {
    //db에 해당 id, email 정보 존재하는지 검색
    let queryRslt = await db.Query('SELECT user_num,user_id,password,user_name,email,user_status FROM User WHERE user_id=? OR email=? ', [user.id, user.email]);
    if (queryRslt.length == 0) { // id, email 모두 db에 없는 경우 -> 바로 insert
        // db에 인증대기 회원으로 등록
        let sql = 'INSERT INTO User SET ?';
        let set = { user_id: user.id, password: user.password, email: user.email, user_name: user.name };
        await db.Query(sql, set);

        // 이메일인증 절차
        let emailResult = await emailAuth.emailAuthentication(user);
        if (!emailResult) { // emailResult가 undefined인 경우
            return { result: false, msg: 'emailResult:undefined, 이메일 전송에 실패했습니다.' }
        }
        if (emailResult.result) {
            return { result: true, msg: '인증코드가 전송되었습니다.',user : {id:user.id, name:user.name, email:user.email} }
        } else {
            console.log(emailResult.message);
            return { result: false, msg: '이메일 전송에 실패했습니다.' }
        }
    } else { // id or email이 db에 존재하는 경우
        // 1. id나 email을 다른 사용자가 쓰고 있는 경우 -> user_status=="가입완료"
        // 2. 사용자가 signup post요청을 했으나 인증을 완료하지 못해 인증대기 상태에 머무르는 경우 -> user_status=="인증대기"

        for (let i = 0; i < queryRslt.length; i++) {
            let elem = queryRslt[i];
            if (user.id == elem.user_id && user.email == elem.email && elem.user_status == '인증대기') { // 2번 case -> 다시 인증메일 전송
                // db pw,user_name와 새로운 pw,user_name값 다를 수 있으므로 업데이트
                if (user.password != elem.password) {
                    await db.Query('UPDATE User SET password= ? WHERE user_num= ?', [user.password, elem.user_num]);
                }
                if (user.name != elem.user_name) {
                    await db.Query('UPDATE User SET user_name= ? WHERE user_num= ?', [user.name, elem.user_num]);
                }

                let emailResult = await emailAuth.emailAuthentication(user);
                console.log("signup.js emailResult:", emailResult)
                if (!emailResult) {
                    return { result: false, msg: '이메일 전송에 실패했습니다.' }
                }
                if (emailResult.result) {
                    return { result: true, msg: '이메일이 전송되었습니다.',user : {id:user.id, name:user.name, email:user.email} }
                } else {
                    console.log(emailResult.message);
                    return { result: false, msg: '이메일 전송에 실패했습니다.' }
                }
            } else if (user.id == elem.user_id) { // 1번 case -> 가입 불가
                console.log('user: ', user.id + ' - sign up fail: ID already exist');
                return { result: false, msg: '이미 사용중인 아이디입니다.' }
            } else if (user.email == elem.email) {
                //이미 사용중인 email인 경우 -> 가입 불가
                console.log('user: ', user.email + ' - sign up fail: email already exist');
                return { result: false, msg: '이미 사용중인 이메일입니다.' }
            }
        }
    }
}

/**
 * userId, userCode를 받아 db에서 authCode 발급내역을 검색, userCode와 일치하면 user_status 업데이트
 * @param {*} userId 
 * @param {*} userCode 
 */
module.exports.signupAuth = async (userId, userCode) => {

    //emailauth 테이블에서 비교하기 위한 user_num 검색
    let result = await db.Query('SELECT user_num FROM User WHERE user_id = ?', [userId]);
    let user_num = result[0].user_num;

    // userId의 user_num을 갖는 인증코드 발급 내역 중 현재 시각으로부터 5분 이내에 발급된 것 중 가장 최근 내역의 auth_code 겁색
    let sql = 'SELECT auth_code FROM EmailAuth WHERE user_num = ? AND auth_time >= DATE_SUB(NOW(), INTERVAL 5 MINUTE) ORDER BY auth_time DESC LIMIT 1'
    let result2 = await db.Query(sql, [user_num]);
    let dbCode = result2[0].auth_code;
    console.log("userInput Code: ", userCode, "db authCode: ", dbCode);

    if (userCode === dbCode) { // 인증코드 일치하는 경우, 회원가입 처리
        await db.Query('UPDATE User SET user_status=\'가입완료\',signup_date=NOW() WHERE user_num= ?;', [user_num]);
        console.log('user: ', userId + ' - sign up success');
        return { result: true, msg: '회원가입에 성공했습니다.' };
    } else { //인증코드 불일치
        return { result: false, msg: '인증코드가 일치하지 않습니다.' }
    }
}