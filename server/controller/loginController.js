const User = require("../models/user.js");

function dateFormat(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;
  hour = hour >= 10 ? hour : "0" + hour;
  minute = minute >= 10 ? minute : "0" + minute;
  second = second >= 10 ? second : "0" + second;

  return date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

/**
 * id,pw값을 받아 db에 검색 후 계정 존재하면 마지막 로그인 시각 업데이트 후 결과값 리턴
 * @param {*} id
 * @param {*} pw
 * @returns
 */
module.exports.login = async (req, res) => {
  const id = req.body.id;
  const pw = req.body.password;

  let findResult = await User.findByIdAndPw(id, pw);
  if (findResult.result) {
    let { userNum, userName } = findResult;
    let timestamp = new Date().getTime();
    let currentDate = new Date(timestamp);
    let currentFormatDate = dateFormat(currentDate);
    let logUpdateResult = User.updateLoginHistory(userNum, currentFormatDate);
    if (logUpdateResult) {
      // 로그인 기록 업데이트 성공
      req.session.userId = id;
      req.session.userNum = userNum;
      req.session.userName = userName;

      console.log("user: ", id + " - login success");
      return { result: true, msg: "로그인에 성공했습니다.", user: { id: id, name: userName } };
    } else {
      // 로그인 기록 업데이트 실패
      console.log("loginController.login : User.updateLoginHistory failed");
      return { result: false, msg: "로그인 정보 업데이트에 실패했습니다." };
    }
  } else {
    //결과 없음
    console.log("user: ", id + " - login fail: No such ID or PW");
    return { result: false, msg: "아이디 또는 비밀번호가 일치하지 않습니다." };
  }
};
