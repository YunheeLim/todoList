const nodemailer = require('nodemailer');
const secret = require('../config/secret');

//smtp 설정 --> ../config/secret.js에 가서 gmail user, password 값 넣어줘야합니다!!
const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: secret.eAuth.user,
        pass: secret.eAuth.pass,
    }
});

//
const sendAuthCode = (email, code, res) => {

    const mailOptions = {
        from: 'todoWeb Team', // 발송 주체
        to: email, // 인증을 요청한 이메일 주소
        subject: '[todoWeb] 회원가입 이메일 인증번호 안내', // 이메일 제목
        text: `아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n
        회원 이메일 👉 ${email}\n
        인증번호 6자리 👉 ${code}`, // 이메일 내용
    };

    smtpTransport.sendMail(mailOptions, (error, res) => {
        if (error) {
            res.status(500).json({
                message: `Failed to send authentication email to ${email}`,
            });
        } else {
            res.status(200).json({
                authNumber,
                message: `Authentication mail is sent to ${email}`,
            });
        }
        smtpTransport.close();
    });
};



const emailAuth = {}

emailAuth.emailAuthentication = async (req, res) => {
    const code = Math.floor(Math.random() * 888888) + 111111;
    const email = req.session.usrEmail;
    req.session.authCode=code;
    await sendAuthCode(email, code, res);
    console.log('email send to '+email+',  req.session.authCode: '+req.session.authCode)
}


module.exports = emailAuth