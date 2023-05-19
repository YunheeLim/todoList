var express = require('express');
var router = express.Router();

const auth = require('../controller/auth.js');
const db = require('../config/db.js');
const sess = require('../controller/sessionChecker.js');


// 회원 가입 요청 처리
router.post('/signup', (req, res) => {
  const { id, name, email, password } = req.body;
  const user = { id, name, email, password };
  console.log(user)
  if (!auth.isValidInput(user)) { // 서버에서 입력 폼의 데이터 검사
    console.log('user: ', req.body.id + ' - sign up fail: invalid input data');
    res.json({ result: 'fail', msg: "유효하지 않은 입력입니다." });
  }
  db.query('SELECT * FROM User WHERE id=?', [id], (err, data) => {
    if (data.length == 0) { // DB에 해당 id에 대한 정보가 없을 경우
      db.query('INSERT INTO User SET ?', user, (err, result) => {
        if (err) {
          throw err;
        }
      })
      console.log('user: ', req.body.id + ' - sign up success');
      res.json({ result: 'success', msg: "회원가입에 성공했습니다." });
    } else { // DB에 중복된 id가 있을 경우
      console.log('user: ', req.body.id + ' - sign up fail: ID already exist');
      res.json({ result: 'fail', msg: "이미 사용중인 ID 입니다." });
    }
  })
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
      res.json({ result: 'success', msg: "로그인에 성공했습니다." });
    } else { // 존재하지 않는 경우
      console.log('user: ', id + ' - login fail: No such ID or PW');
      res.json({ result: 'fail', msg: "아이디 또는 비밀번호가 일치하지 않습니다." });
    }
  })
})

// 로그아웃 요청 처리
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.json({result:'success'});
})

module.exports = router;
