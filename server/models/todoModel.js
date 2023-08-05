const db = require("../config/db.js");

/**
 * 해당 userNum의 해당 년월의 투두 조회
 * @param {*} userNum
 * @param {*} year
 * @param {*} month
 */
module.exports.getMonthTodo = async (userNum, year, month) => {
  let sql =
    "SELECT t.todo_id,t.user_num,t.cat_id,c.cat_title,t.todo_date,t.todo_cont,t.todo_time,t.todo_checked FROM todo as t, category as c WHERE t.cat_id=c.cat_id AND t.user_num=? AND YEAR(t.todo_date)=? AND MONTH(t.todo_date)=? ORDER BY DATE(t.todo_date),t.cat_id,t.todo_create_time;";

  let sqlResult = await db.Query(sql, [userNum, year, month]);

  let todoResult = [];
  sqlResult.forEach((item) => {
    year = item.todo_date.getFullYear();
    month = item.todo_date.getMonth() + 1;
    day = item.todo_date.getDate();

    const dayIdx = todoResult.findIndex((todoItem) => todoItem.year === year && todoItem.month === month && todoItem.day === day);
    if (dayIdx != -1) {
      // todoResult에 해당 날짜 JSON 이미 존재함 -> 해당 카테고리 존재하는지 확인
      const catIdx = todoResult[dayIdx].categorys.findIndex((catItem) => catItem.cat_id === item.cat_id);
      if (catIdx != -1) {
        // 해당 날짜의 해당 카테고리 JSON 이미 존재함 -> todo 데이터 넣기
        todoResult[dayIdx].categorys[catIdx].todos.push(item);
      } else {
        // 해당 날짜는 존재하지만 카테고리는 존재하지 않음 -> 카테고리 정보와 함께 todo  데이터 넣기
        todoResult[dayIdx].categorys.push({ cat_id: item.cat_id, cat_title: item.cat_title, todos: [item] });
      }
    } else {
      // todoResult에 해당 날짜 JSON 존재하지 않음 -> 날짜 정보, 카테고리 정보와 함께 todo 데이터 넣기
      todoResult.push({ year: year, month: month, day: day, categorys: [{ cat_id: item.cat_id, cat_title: item.cat_title, todos: [item] }] });
    }
  });
  return todoResult;
};

/**
 * 해당 userNum이 가진 카테고리 조회
 * @param {*} userNum
 * @returns
 */
module.exports.getCategories = async (userNum) => {
  let sql = "SELECT cat_id,cat_title,cat_access,user_num FROM Category WHERE user_num=?;";
  let catResult = await db.Query(sql, [userNum]);
  return catResult;
};
