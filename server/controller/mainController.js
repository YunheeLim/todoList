const db = require("../config/db.js");

/**
 *
 * @param {*} fromId 요청 보내는 user의 ID
 * @param {*} toId 투두 조회 대상의 user ID
 * @param {*} year
 * @param {*} month
 */
module.exports.getMonthlyTodo = async (fromId, toId, year, month) => {
  if (fromId == undefined) {
    return { msg: "session expired." };
  }

  let fromNum = await db.Query("SELECT user_num FROM User WHERE user_id=?", [
    fromId,
  ]);
  fromNum = fromNum[0].user_num;
  let toNum = await db.Query("SELECT user_num FROM User WHERE user_id=?", [
    toId,
  ]);
  toNum = toNum[0].user_num;

  if (fromNum === toNum) {
    // 본인의 투두 목록 조회 시
    let sql =
      "SELECT * FROM todo as t, category as c WHERE t.cat_id=c.cat_id AND t.user_num=? AND YEAR(t.todo_date)=? AND MONTH(t.todo_date)=? ORDER BY DATE(t.todo_date),t.cat_id,t.todo_id;";
    todoResult = await db.Query(sql, [toNum, year, month]);
    console.log("========== tyoe if ==============");
    console.log(typeof todoResult);
    return todoResult;
  }
};
