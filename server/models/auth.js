const db = require("../config/db.js");

module.exports.getValidAuthCode = async (userNum) => {
  // userNum을 갖는 인증코드 발급 내역 중 현재 시각으로부터 5분 이내에 발급된 것 중 가장 최근 내역의 auth_code 겁색
  let sql = "SELECT auth_code FROM EmailAuth WHERE user_num = ? AND auth_time >= DATE_SUB(NOW(), INTERVAL 5 MINUTE) ORDER BY auth_time DESC LIMIT 1";
  let result = await db.Query(sql, [userNum]);
  console.log(result);
  return result;
};
