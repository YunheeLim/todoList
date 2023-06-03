const db = require('../config/db.js');
const emailAuth = require('../controller/emailAuth.js');


const signUp = {}

/**
 * post(/signup)요청 처리 : db에 인증대기 회원으로 등록 후 인증메일 전송
 * @param {*} user 회원가입 user 정보
 * @returns {*} {result,msg}
 */
signUp.signup = async (user) => {
    //db에 해당 id, email 정보 존재하는지 검색
    let queryRslt = await db.Query('SELECT user_id,email,user_status FROM User WHERE user_id=? OR email=? ', [user.id, user.email]);
    if (queryRslt.length == 0) { // id, email 모두 db에 없는 경우 -> 바로 insert
        // db에 인증대기 회원으로 등록
        let sql = 'INSERT INTO User SET ?'
        let set = { user_id: user.id, password: user.password, email: user.email }
        await db.Query(sql, set);

        // 이메일인증 절차
        let emailResult = await emailAuth.emailAuthentication(user);
        if(!emailResult){ // emailResult가 undefined인 경우
            return { result: false, msg: 'emailResult:undefined, 이메일 전송에 실패했습니다.' }
        }
        if (emailResult.result) {
            return { result: true, msg: '인증코드가 전송되었습니다.' }
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
                let emailResult = await emailAuth.emailAuthentication(user);
                console.log("signup.js emailResult:",emailResult)
                if(!emailResult){
                    return { result: false, msg: '이메일 전송에 실패했습니다.' }
                }
                if (emailResult.result) {
                    return { result: true, msg: '이메일이 전송되었습니다.' }
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

module.exports = signUp;