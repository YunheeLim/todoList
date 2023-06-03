const express = require('express');
const router = express.Router();
const session = require('express-session');

const auth = require('../controller/auth.js');
const db = require('../config/db.js');
const sess = require('../controller/sessionChecker.js');
const { raw } = require('body-parser');

const signupController = require('../controller/signupController.js');
const loginController = require('../controller/loginController.js');

// index 페이지 
router.get('/', sess.sessionExist, function (req, res, next) {
  res.redirect('/main');
});

// index 페이지 렌더링
router.get('/index', (req, res) => {
  res.render('index');
});

// signup 페이지 렌더링
router.get('/signup', sess.sessionNotExist, (req, res) => {
  res.render('signup');
});

// 회원 가입 요청 처리
router.post('/signup', async (req, res) => {
  const { id, name, email, password } = req.body;
  const user = { id: id, name: name, email: email, password: password };
  console.log(user)
  if (!auth.isValidInput(user)) { // 서버에서 입력 폼의 데이터 검사
    console.log('user: ', user.id + ' - sign up fail: invalid input data');
    res.render('signup', { error: '유효하지 않은 입력입니다.' });
  }
  let signupResult = await signupController.signup(user);
  console.log("signupResult:", signupResult);
  if (signupResult.result) {
    req.session.signupId = user.id; // signupAuth 처리할 때 아이디 주기 위해 세션에 저장
    let msg = email + " 주소로 인증코드가 전송되었습니다. 인증코드를 제출해 이메일 인증을 완료해주세요."
    res.render('signupAuth', { msg: msg });
  } else {
    res.render('signup', { error: signupResult.msg, id: user.id, name: user.name, email: user.email })
  }
});

// 인증메일 발송 & 이메일인증 페이지 렌더링
router.get('/signupAuth', sess.sessionNotExist, (req, res) => {
  if (req.session.user.email) { // 세션에 이메일이 있는 경우 (정상적인 접근)
    let msg = req.session.user.email + " 주소로 인증코드가 전송되었습니다. 인증코드를 제출해 이메일 인증을 완료해주세요."
    res.render('signupAuth', { msg: msg });
  } else { // 세션에 이메일 없는 경우 (비정상적 접근)
    res.render('accessFail', { msg: '비정상적 접근입니다.' })
  }
})

// 사용자가 제출한 인증코드 값 비교 후 회원가입 처리
router.post('/signupAuth', async (req, res) => {
  const usrInput = Number(req.body.authCode);
  let signupAuthResult = await signupController.signupAuth(req.session.signupId, usrInput);
  if (signupAuthResult.result) { // 인증 성공
    delete req.session.signupId;
    res.redirect('/signupResult');
  } else { // 인증 실패
    res.render('signupAuth', { msg: signupAuthResult.msg });
  }
})

// 회원가입완료 페이지 렌더링
router.get('/signupResult', sess.sessionNotExist, (req, res) => {
  res.render('signupResult');
})

// login 페이지 렌더링
router.get('/login', sess.sessionNotExist, (req, res) => {
  res.render('login');
});

// 로그인 요청 처리
router.post('/login', async (req, res) => {
  const id = req.body.id;
  const pw = req.body.password;

  let loginResult = await loginController.login(id, pw);
  if (loginResult.result) {
    req.session.userId = req.body.id;
    res.redirect('main');
  } else {
    res.render('login', { error: loginResult.msg });
  }
})

// main 페이지 렌더링
router.get('/main', sess.sessionExist, (req, res) => {
  res.render('main', { name: req.session.userId });
});

// logout 페이지 렌더링
router.get('/logout', (req, res) => {
  req.session.destroy()
  // req.session.is_logined=false;
  res.render('logout');
});

module.exports = router;
