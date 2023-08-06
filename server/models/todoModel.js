const db = require("../config/db.js");

/**
 * 해당 userNum의 해당 년월의 투두 조회
 * @param {*} userNum
 * @param {*} year
 * @param {*} month
 */
module.exports.getMonthTodo = async (userNum, year, month) => {
  let sql =
    "SELECT t.todo_id,t.user_num,t.cat_id,c.cat_title,t.todo_date,t.todo_cont,t.todo_time,t.todo_checked,c.cat_access FROM todo as t, category as c WHERE t.cat_id=c.cat_id AND t.user_num=? AND YEAR(t.todo_date)=? AND MONTH(t.todo_date)=? ORDER BY DATE(t.todo_date),t.cat_id,t.todo_create_time;";
  let todoResult = await db.Query(sql, [userNum, year, month]);
  return todoResult;
};
