const express = require("express");
const router = express.Router();
const sess = require("../controller/sessionChecker.js");

const signupController = require("../controller/signupController.js");
const loginController = require("../controller/loginController.js");
const mainController = require("../controller/mainController.js");

/*
req.session : 로그인 성공 시 저장
{
  userId : 회원 아이디
  userNum : 회원번호
  userName : 회원 닉네임
}
*/

// index 페이지
router.get("/", sess.sessionExist, function (req, res, next) {
  res.redirect("/main");
});

// index 페이지 렌더링
router.get("/index", (req, res) => {
  res.render("index");
});

// signup 페이지 렌더링
router.get("/signup", sess.sessionNotExist, (req, res) => {
  res.render("signup");
});

// 회원 가입 요청 처리
router.post("/signup", async (req, res) => {
  let signupResult = await signupController.signup(req, res);

  console.log("signupResult:", signupResult);

  if (signupResult.msg == "유효하지 않은 입력입니다.") {
    res.render("signup", { error: "유효하지 않은 입력입니다." });
  }
  if (signupResult.result) {
    let msg = req.body.email + " 주소로 인증코드가 전송되었습니다. 인증코드를 제출해 이메일 인증을 완료해주세요.";
    res.render("signupAuth", { msg: msg });
  } else {
    res.render("signup", {
      error: signupResult.msg,
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
    });
  }
});

// 인증메일 발송 & 이메일인증 페이지 렌더링 -> 사용 안되고 있음
router.get("/signupAuth", sess.sessionNotExist, (req, res) => {
  console.log("req.session: ", req.session);
  if (req.session.user.email) {
    // 세션에 이메일이 있는 경우 (정상적인 접근)
    let msg = req.session.user.email + " 주소로 인증코드가 전송되었습니다. 인증코드를 제출해 이메일 인증을 완료해주세요.";
    res.render("signupAuth", { msg: msg });
  } else {
    // 세션에 이메일 없는 경우 (비정상적 접근)
    res.render("accessFail", { msg: "비정상적 접근입니다." });
  }
});

// 사용자가 제출한 인증코드 값 비교 후 회원가입 처리
router.post("/signupAuth", async (req, res) => {
  let signupAuthResult = await signupController.signupAuth(req, res);
  console.log("signupAuthResult: ", signupAuthResult);
  if (signupAuthResult.result) res.redirect("/signupResult");
  else {
    // 인증 실패
    res.render("signupAuth", { msg: signupAuthResult.msg });
  }
});

// 회원가입완료 페이지 렌더링
router.get("/signupResult", sess.sessionNotExist, (req, res) => {
  res.render("signupResult");
});

// login 페이지 렌더링
router.get("/login", sess.sessionNotExist, (req, res) => {
  res.render("login");
});

// 로그인 요청 처리
router.post("/login", async (req, res) => {
  let loginResult = await loginController.login(req, res);
  console.log("loginResult: ", loginResult);
  if (loginResult.result) {
    console.log("req.session: ", req.session.userNum, req.session.userId, req.session.userName);
    res.redirect("/main");
  } else {
    res.render("login", { error: loginResult.msg });
  }
});

// main 페이지 렌더링
router.get("/main", sess.sessionExist, (req, res) => {
  res.render("main", {
    name: req.session.userName,
    userId: req.session.userId,
  });
});

// logout 페이지 렌더링
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("logout");
});

// todo 목록 get 요청 처리
router.get("/main/todo", async (req, res) => {
  let todoData = await mainController.getMonthlyTodo(req, res);
  res.json(todoData);
});

// 카테고리 목록 get 요청 처리
router.get("/main/category", async (req, res) => {
  let catData = await mainController.getCategory(req, res);
  res.json(catData);
});

// todo 추가 요청 처리
router.post("/main/todo", async (req, res) => {
  let insertResult = await mainController.insertTodo(req, res);
  res.json(insertResult);
});

// todo check / uncheck 요청 처리
router.post("/main/todo/check", async (req, res) => {
  let checkResult = await mainController.checkTodo(req, res);
  res.json(checkResult);
});

module.exports = router;
