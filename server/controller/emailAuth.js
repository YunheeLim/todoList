const nodemailer = require('nodemailer');
const secret = require('../config/secretNew');
const db = require('../config/db.js');

/**
 * 이메일 주소로 인증코드를 전송하고 메일 전송의 결과를 리턴
 * @param {*} email 
 * @param {*} code 
 * @returns 
 */
const sendAuthCode = async (email, code) => {
    return new Promise((resolve,reject)=>{
        //메일 계정 설정
        let smtpTransport=nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: secret.eAuth.user,
                pass: secret.eAuth.pass,
            }
        });

        //메일 옵션 설정
        const mailOptions = {
            from: 'todoWeb Team', // 발송 주체
            to: email, // 인증을 요청한 이메일 주소
            subject: '[todoWeb] 회원가입 이메일 인증번호 안내', // 이메일 제목
            text: `아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n
            회원 이메일 👉 ${email}\n
            인증번호 6자리 👉 ${code}`, // 이메일 내용
        };

        //인증메일  전송
        smtpTransport.sendMail(mailOptions, (error, result) => {
            if (error) {
                console.log(error)
                smtpTransport.close();
                resolve({
                    result: false,
                    message: `Failed to send authentication email to ${email}`,
                    err: error.message
                }) 
            } else {
                console.log('email send to ' + email + ', authCode: ' + code)
                smtpTransport.close();
                resolve( {
                    result: true,
                    message: `Authentication mail is sent to ${email}`
                });
            }
        });
    })
};


/**
 * 1.authCode 생성    2.db애 authCode 저장    3.인증메일 전송
 * @param {*} user user 정보
 * @returns sendAuthCode의 리턴값
 */
module.exports.emailAuthentication = async (user) => {
    //authCode 생성
    const code = Math.floor(Math.random() * 888888) + 111111;

    //db에 authCode 저장
    let result = await db.Query('SELECT user_num FROM User WHERE user_id = ?', [user.id]);
    let user_num = result[0].user_num;
    await db.Query('INSERT INTO EmailAuth SET ?', { user_num: user_num, auth_code: code });

    //인증 메일 전송
    let sendMailResult = await sendAuthCode(user.email, code);
    
    return sendMailResult;
}