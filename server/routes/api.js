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

router.get("/main/category", async (req, res) => {
  let catData = await mainController.getCategory(req, res);
  res.json(catData);
});

router.post("/main/todo", async (req, res) => {
  let insertResult = await mainController.insertTodo(req, res);
  res.json(insertResult);
});

module.exports = router;
