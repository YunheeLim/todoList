const db = require("../config/db.js");

module.exports.findByIdOrEmail = async (id, email) => {
  let result = await db.Query("SELECT user_num,user_id,password,user_name,email,user_status FROM User WHERE user_id=? OR email=? ", [id, email]);

  return result;
};

module.exports.insertUser = async (user) => {
  let sql = "INSERT INTO User SET ?";
  let set = {
    user_id: user.id,
    password: user.password,
    email: user.email,
    user_name: user.name,
  };
  let insertResult = await db.Query(sql, set);
  let userNum = insertResult["insertId"]; // insert query의 리턴값에서 회원 번호 저장
  return userNum;
};

module.exports.updatePassword = async (newPw, userNum) => {
  await db.Query("UPDATE User SET password= ? WHERE user_num= ?", [newPw, userNum]);
};

module.exports.updateUserName = async (newName, userNum) => {
  await db.Query("UPDATE User SET user_name= ? WHERE user_num= ?", [newName, userNum]);
};

module.exports.signUpUser = async (userNum) => {
  await db.Query("UPDATE User SET user_status='가입완료',signup_date=NOW() WHERE user_num= ?;", [userNum]);
};
