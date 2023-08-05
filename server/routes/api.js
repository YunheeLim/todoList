var express = require('express');
var router = express.Router();

const auth = require('../controller/auth.js');
const db = require('../config/db.js');
const sess = require('../controller/sessionChecker.js');

const signupController = require('../controller/signupController.js');
const loginController = require('../controller/loginController.js');

/*
req.session
{
  userNum : 회원번호 -> signup 폼 제출 ~ 인증완료 사이에 존재, 로그인 상태일때 존재
}
*/

// 세션 가져오기 위한 라우터
router.get('/main', sess.sessionExist, function (req, res) {
  res.json(req.session);
});

// 회원 가입 요청 처리
router.post('/signup', async (req, res) => {
  const { id, name, email, password } = req.body;
  const user = { id, name, email, password };
  console.log(user)
  if (!auth.isValidInput(user)) { // 서버에서 입력 폼의 데이터 검사
    console.log('user: ', req.body.id + ' - sign up fail: invalid input data');
    res.json({ result: false, msg: "유효하지 않은 입력입니다." });
  }

  let signupResult = await signupController.signup(user);
  if(signupResult.result){ // db에 유저 정보 등록되면 세션에도 회원번호 저장
    req.session.userNum=signupResult.userNum;
    req.session.userEmail = signupResult.user.email;
  }
  console.log("signupResult:", signupResult);
  response={result: signupResult.result, msg:signupResult.msg, user:signupResult.user};
  res.json(response);
});


// 인증메일 발송 & 이메일인증 페이지 렌더링 -> 사용 안되고 있음
router.get('/signupAuth', sess.sessionNotExist, (req, res) => {
  console.log("req.session: ",req.session)
  if (req.session.userEmail) { // 세션에 이메일이 있는 경우 (정상적인 접근)
    let msg = req.session.userEmail + " 주소로 인증코드가 전송되었습니다. 인증코드를 제출해 이메일 인증을 완료해주세요."
    res.json({msg:msg});
    // res.render('signupAuth', { msg: msg });
  } else { // 세션에 이메일 없는 경우 (비정상적 접근)
    res.json({msg:'비정상적 접근입니다.'});
    // res.render('accessFail', { msg: '비정상적 접근입니다.' })
  }
})

// 인증코드 폼 제출 요청 처리
router.post('/signupAuth', async (req, res) => {
  const usrInput = Number(req.body.authCode);
  let signupAuthResult = await signupController.signupAuth(req.session.userNum, usrInput);
  if (signupAuthResult.result) { // 인증 성공
    delete req.session.userNum;
  }
  res.json(signupAuthResult);
})

// 로그인 요청 처리
router.post('/login', async (req, res) => {
  const id = req.body.id;
  const pw = req.body.password;
  let loginResult = await loginController.login(id, pw);
  if (loginResult.result) { // 로그인 성공
    req.session.userNum = loginResult.userNum;
    req.session.userName = loginResult.user.name;
    response={result: loginResult.result, msg:loginResult.msg, user:loginResult.user};
    res.json(response);
  }else{
    res.json(loginResult);
  }
})

// 로그아웃 요청 처리
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.json({ result: 'success' });
})

module.exports = router;
