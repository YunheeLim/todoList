const express = require('express');
const router = express.Router();
const session = require('express-session');

const auth = require('../controller/auth.js');
const db = require('../config/db.js');
const sess = require('../controller/sessionChecker.js');
const emailAuth = require('../controller/emailAuth.js');
const { raw } = require('body-parser');



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
router.post('/signup', (req, res) => {
  const { id, name, email, password } = req.body;
  const user = { id: id, name: name, email: email, password: password };
  console.log(user)
  if (!auth.isValidInput(user)) { // 서버에서 입력 폼의 데이터 검사
    console.log('user: ', req.body.id + ' - sign up fail: invalid input data');
    res.render('signup', { error: '유효하지 않은 입력입니다.' });
  }
  db.query('SELECT * FROM User WHERE id=?', [id], (err, data) => {
    if (data.length == 0) { // DB에 해당 id에 대한 정보가 없을 경우
      // 이메일 인증 절차
      req.session.usrEmail = user.email;
      req.session.user = user; // post(/signupAuth)에서 db에 정보 넣기 위해 세션에 user 정보 저장...
      emailAuth.emailAuthentication(req, res);
      res.redirect('/signupAuth');
    } else { // DB에 중복된 id가 있을 경우
      console.log('user: ', req.body.id + ' - sign up fail: ID already exist');
      res.render('signup', { error: '이미 사용중인 ID 입니다.', id: user.id, name: user.name, email: user.email });
    }
  })
});

// 인증메일 발송 & 이메일인증 페이지 렌더링
router.get('/signupAuth', sess.sessionNotExist, (req, res) => {
  if (req.session.usrEmail) { // 세션에 이메일이 있는 경우
    // emailAuth.emailAuthentication(req, res); // 근데 이렇게 하면 안된다 인증메일 하나 받아놓고 또 다시 /signupAuth로 접속하면 자동으로 메일이 또 발송되고 세션의 authCode도 값이 바뀐다
    let msg = req.session.usrEmail + " 주소로 인증코드가 전송되었습니다. 인증코드를 제출해 이메일 인증을 완료해주세요."
    res.render('signupAuth', { msg: msg });
  } else { // 세션에 이메일 없이 비정상적 접근인 경우
    res.render('accessFail', { msg: '비정상적 접근입니다.' })
  }
})

// 사용자가 제출한 인증코드 값 비교 후 회원가입 처리
router.post('/signupAuth', (req, res) => {
  const usrInput = Number(req.body.authCode);
  console.log("usr Input: " + usrInput + ", session value: " + req.session.authCode);
  if (usrInput === req.session.authCode) { // 인증코드 일치하는 경우, 회원가입 처리
    db.query('INSERT INTO User SET ?', req.session.user, (err, result) => {
      if (err) {
        throw err;
      }
    })
    console.log('user: ', req.session.user.id + ' - sign up success');
    delete req.session.user; // db에 입력하기 위해 임시로 저장한 req.session.user 삭제
    res.redirect('/signupResult');
  } else { // 인증코드 불일치
    let msg = "인증코드가 일치하지 않습니다."
    res.render('signupAuth', { msg: msg })
  }
})

// 회원가입완료 페이지 렌더링
router.get('/signupResult', (req, res) => {
  res.render('signupResult');
})

// login 페이지 렌더링
router.get('/login', sess.sessionNotExist, (req, res) => {
  res.render('login');
});

// 로그인 요청 처리
router.post('/login', (req, res) => {
  const id = req.body.id;
  const pw = req.body.password;

  db.query('SELECT * FROM User WHERE id=? AND password=?', [id, pw], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length != 0) { // 결과 존재하는 경우
      console.log('user: ', id + ' - login success');
      req.session.isLogined = true;
      req.session.userId = req.body.id;
      res.redirect('main');
    } else { // 존재하지 않는 경우
      console.log('user: ', id + ' - login fail: No such ID or PW');
      res.render('login', { error: '존재하지 않는 아이디 또는 비밀번호 입니다.' });
    }
  })
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
