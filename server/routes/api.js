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

router.get("/signupAuth", (req, res) => {
  res.json({ email: req.session.userEmail });
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

router.get("/main", (req, res) => {
  if (req.session.userId && req.session.userName && req.session.userNum) {
    res.json({ result: true, userId: req.session.userId, userName: req.session.userName, userNum: req.session.userNum });
  } else {
    res.json({ result: false, msg: "유저 정보를 찾을 수 없습니다." });
  }
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

// todo check / uncheck 요청 처리
router.post("/main/todo/check", async (req, res) => {
  let checkResult = await mainController.checkTodo(req, res);
  res.json(checkResult);
});

// 투두 항목 삭제
router.delete("/main/todo", async (req, res) => {
  let deleteResult = await mainController.deleteTodo(req, res);
  res.json(deleteResult);
});

// 투두 항목 수정
router.put("/main/todo", async (req, res) => {
  let updateResult = await mainController.updateTodo(req, res);
  res.json(updateResult);
});

//카테고리 추가
router.post("/main/category", async (req, res) => {
  let insertResult = await mainController.insertCategory(req, res);
  res.json(insertResult);
});

// 카테고리 이름 수정
router.put("/main/category", async (req, res) => {
  let updateResult = await mainController.updateCategory(req, res);
  res.json(updateResult);
});

//카테고리 삭제
router.delete("/main/category", async (req, res) => {
  let deleteResult = await mainController.deleteCategory(req, res);
  res.json(deleteResult);
});

module.exports = router;
