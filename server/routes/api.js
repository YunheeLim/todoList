var express = require("express");
var router = express.Router();

const auth = require("../controller/auth.js");
const db = require("../config/db.js");
const sess = require("../controller/sessionChecker.js");

const signupController = require("../controller/signupController.js");
const loginController = require("../controller/loginController.js");

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

// 인증코드 폼 제출 요청 처리
router.post("/signupAuth", async (req, res) => {
  let signupAuthResult = await signupController.signupAuth(req, res);
  console.log("signupAuthResult: ", signupAuthResult);
  res.json(signupAuthResult);
});

// 로그인 요청 처리
router.post("/login", async (req, res) => {
  const id = req.body.id;
  const pw = req.body.password;
  let loginResult = await loginController.login(id, pw);
  if (loginResult.result) {
    // 로그인 성공
    req.session.userNum = loginResult.userNum;
    response = {
      result: loginResult.result,
      msg: loginResult.msg,
      user: loginResult.user,
    };
    res.json(response);
  } else {
    res.json(loginResult);
  }
});

// 로그아웃 요청 처리
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ result: true });
});

module.exports = router;
