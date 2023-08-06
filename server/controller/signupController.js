const emailAuth = require("./emailAuthController.js");
const auth = require("../controller/auth.js");
const User = require("../models/userModel.js");
const Auth = require("../models/authModel.js");

/**
 * post(/signup)요청 처리 : db에 인증대기 회원으로 등록 후 인증메일 전송
 * @param {*}
 * @returns {result,msg,user}
 */
module.exports.signup = async (req, res) => {
  const { id, name, email, password } = req.body;
  const user = { id, name, email, password };
  console.log(user);

  if (!auth.isValidInput(user)) {
    // 서버에서 입력 폼의 데이터 검사
    console.log("user: ", req.body.id + " - sign up fail: invalid input data");
    return { result: false, msg: "유효하지 않은 입력입니다." };
  }

  //db에 해당 id, email 정보 존재하는지 검색
  let queryRslt = await User.findByIdOrEmail(id, email);
  if (queryRslt.length == 0) {
    // id, email 모두 db에 없는 경우 -> 바로 insert
    // db에 인증대기 회원으로 등록
    var userNum = await User.insertUser(user); // insert한 회원의 회원 번호 저장

    // 이메일 전송
    var emailResult = await emailAuth.emailAuthentication(user);
  } else {
    // id or email이 db에 존재하는 경우
    // 1. id나 email을 다른 사용자가 쓰고 있는 경우 -> user_status=="가입완료"
    // 2. 사용자가 signup post요청을 했으나 인증을 완료하지 못해 인증대기 상태에 머무르는 경우 -> user_status=="인증대기"
    for (let i = 0; i < queryRslt.length; i++) {
      let elem = queryRslt[i];
      if (user.id == elem.user_id && user.email == elem.email && elem.user_status == "인증대기") {
        // 2번 case -> 다시 인증메일 전송
        // db pw,user_name와 새로운 pw,user_name값 다를 수 있으므로 업데이트
        if (user.password != elem.password) await User.updatePassword(user.password, elem.user_num);
        if (user.name != elem.user_name) await User.updateUserName(user.name, elem.user_num);

        var userNum = elem.user_num; // 해당 회원의 회원 번호 저장

        var emailResult = await emailAuth.emailAuthentication(user); // 이메일 전송
      } else if (user.id == elem.user_id) {
        // 1번 case -> 가입 불가
        console.log("user: ", user.id + " - sign up fail: ID already exist");
        return { result: false, msg: "이미 사용중인 아이디입니다." };
      } else if (user.email == elem.email) {
        console.log("user: ", user.email + " - sign up fail: email already exist");
        return { result: false, msg: "이미 사용중인 이메일입니다." };
      }
    }
  }
  if (!emailResult) {
    // emailResult가 undefined인 경우
    return {
      result: false,
      msg: "emailResult:undefined, 이메일 전송에 실패했습니다.",
    };
  }
  if (emailResult.result) {
    //인증코드 전송 성공
    req.session.userEmail = user.email;
    req.session.userNum = userNum;
    console.log("req.session.userNum: ", req.session.userNum);
    return {
      result: true,
      msg: "인증코드가 전송되었습니다.",
      user: { id: user.id, name: user.name, email: user.email },
    };
  } else {
    console.log(emailResult.message);
    return { result: false, msg: "이메일 전송에 실패했습니다." };
  }
};

/**
 * userId, userCode를 받아 db에서 authCode 발급내역을 검색, userCode와 일치하면 user_status 업데이트
 * @param {*} userId
 * @param {*} userCode
 */
module.exports.signupAuth = async (req, res) => {
  const userInput = Number(req.body.authCode);

  // 해당 회원의 유효 인증번호 조회
  result = await Auth.getValidAuthCode(req.session.userNum);
  if (result.length != 0) {
    // 인증코드 발급 내역 존재
    let dbCode = result[0].auth_code;
    console.log("userInput Code: ", userInput, "db authCode: ", dbCode);
    if (userInput === dbCode) {
      // 인증코드 일치하는 경우 -> 회원가입 처리
      User.signUpUser(req.session.userNum);
      console.log("userNum: ", req.session.userNum + " - sign up success");
      delete req.session.userNum;
      return { result: true, msg: "회원가입에 성공했습니다." };
    } else {
      //인증코드 불일치
      return { result: false, msg: "인증코드가 일치하지 않습니다." };
    }
  } else {
    return { result: false, msg: "인증코드 유효기간이 만료되었습니다." };
  }
};
