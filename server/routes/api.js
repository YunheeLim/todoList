var express = require('express');
var router = express.Router();

const auth = require('../controller/auth.js');
const db = require('../config/db.js');
const sess = require('../controller/sessionChecker.js');
const emailAuth=require('../controller/emailAuth.js');
const signupController=require('../controller/signUp.js');


// 회원 가입 요청 처리
// 리액트에서는 이후에 email 인증코드 확인하는 페이지로 연결해주어야함!!
router.post('/signup', async (req, res) => {
  const { id, name, email, password } = req.body;
  const user = { id, name, email, password };
  console.log(user)
  if (!auth.isValidInput(user)) { // 서버에서 입력 폼의 데이터 검사
    console.log('user: ', req.body.id + ' - sign up fail: invalid input data');
    res.json({ result: false, msg: "유효하지 않은 입력입니다." });
  }

  let signupResult=await signupController.signup(user);
  console.log("signupResult:",signupResult);
  if(signupResult.result){ // 메일 전송 성공
    res.json({result:true, msg:signupResult.msg, email:email});
  } else{ // 메일 전송 실패 또는 id,email 중복
    res.json({result:false, msg:signupResult.msg});
  }
});

router.post('/signupAuth',async (req,res)=>{
  const usrInput = Number(req.body.authCode);
  console.log("usr Input: " + usrInput + ", session value: " + req.session.authCode);
  if (usrInput === req.session.authCode) { // 인증코드 일치하는 경우, 회원가입 처리
    let result = await db.Query('INSERT INTO User SET ?', req.session.user);
    console.log('user: ', req.session.user.id + ' - sign up success');
    delete req.session.user; // db에 입력하기 위해 임시로 저장한 req.session.user 삭제
    res.json({result:"success",msg:"회원가입에 성공했습니다."});
  } else { // 인증코드 불일치
    res.json({result:'fail',msg:'인증코드가 일치하지 않습니다.'})
  }
})

// 로그인 요청 처리
router.post('/login', async (req, res) => {
  const id = req.body.id;
  const pw = req.body.password;

  let result = await db.Query ('SELECT * FROM User WHERE id=? AND password=?', [id, pw]);
  if (result.length!=0){ // 결과 존재
    console.log('user: ', id + ' - login success');
    req.session.isLogined = true;
    req.session.userId = req.body.id;
    res.json({ result: 'success', msg: "로그인에 성공했습니다." });
  } else{ //결과 없음
    console.log('user: ', id + ' - login fail: No such ID or PW');
    res.json({ result: 'fail', msg: "아이디 또는 비밀번호가 일치하지 않습니다." });
  }
})

// 로그아웃 요청 처리
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.json({result:'success'});
})

module.exports = router;
