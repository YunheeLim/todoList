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
  }
  console.log("signupResult:", signupResult);
  response={result: signupResult.result, msg:signupResult.msg, user:signupResult.user};
  res.json(response);
});

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
