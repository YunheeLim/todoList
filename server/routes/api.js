var express = require("express");
var router = express.Router();

const signupController = require("../controller/signupController.js");
const loginController = require("../controller/loginController.js");
const mainController = require("../controller/mainController.js");

/*
req.session
{
  userNum : 회원번호 -> signup 폼 제출 ~ 인증완료 사이에 존재, 로그인 상태일때 존재
}
*/

// 회원 가입 요청 처리
router.post("/signup", async (req, res) => {
  let signupResult = await signupController.signup(req, res);
  console.log("signupResult:", signupResult);
  res.json(signupResult);
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
router.post("/signupAuth", async (req, res) => {
  let signupAuthResult = await signupController.signupAuth(req, res);
  console.log("signupAuthResult: ", signupAuthResult);
  res.json(signupAuthResult);
});

// 로그인 요청 처리
router.post("/login", async (req, res) => {
  let loginResult = await loginController.login(req, res);
  console.log("loginResult: ", loginResult);

  if (loginResult.result) console.log("req.session: ", req.session.userNum, req.session.userId, req.session.userName);

  res.json(loginResult);
});

// 로그아웃 요청 처리
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ result: true });
});

router.get("/main/todo", async (req, res) => {
  let todoData = await mainController.getMonthlyTodo(req, res);
  res.json(todoData);
});

module.exports = router;
