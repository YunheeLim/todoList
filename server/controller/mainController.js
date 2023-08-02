const db = require("../config/db.js");

/*
todoArray = [ , , , , , ...  ] : 해당 월의 날짜수만큼의 array
todoArray[8] = [ {}, {}, {}, ... ] : 해당 일(9일)의 카테고리만큼의 JSON array
todoArray[8].todo = [ , , , , ... ] : 해당 일(9일)의
*/

function setTodoArray(dates, cats, sqlResult) {
  let todoArray = new Array(dates); // 해당 월의 일수만큼 array 생성
  for (i = 0; i < dates; i++) {
    todoArray[i] = new Array(cats).fill({});
  }

  for (i = 0; i < sqlResult.length; i++) {
    // todoResult를 돌면서 todo_date의 일자에 해당하는 idx의 array 중에서, cat_id에 해당하는 JSON의 todo key의 value로 항목을 추가
    const dateString = todoResult[i].todo_date;
    const date = new Date(dateString);
    todoData[date.getDate() - 1].push(todoResult[i]);
  }
}
/**
 *조회 대상의 해당 월 todo 목록을 3차원 배열(date * cat * todo)형태로 반환
 * @param {*} fromId 요청 보내는 user의 ID
 * @param {*} toId 투두 조회 대상의 user ID
 * @param {*} year
 * @param {*} month
 */
module.exports.getMonthlyTodo = async (fromId, toId, year, month) => {
  if (fromId == undefined) {
    // 세션 만료된 경우
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

  // 해당 월의 일수만큼의 빈 array 생성
  var lastDay = new Date(year, month, 0);
  var endDate = lastDay.getDate();

  // 본인의 투두 목록 조회 시
  if (fromNum === toNum) {
    let sql =
      "SELECT t.todo_id,t.user_num,t.cat_id,c.cat_title,t.todo_date,t.todo_cont,t.todo_time,t.todo_checked,c.cat_access FROM todo as t, category as c WHERE t.cat_id=c.cat_id AND t.user_num=? AND YEAR(t.todo_date)=? AND MONTH(t.todo_date)=? ORDER BY DATE(t.todo_date),t.cat_id,t.todo_create_time;";
    todoResult = await db.Query(sql, [toNum, year, month]); // 조회 대상의 todo 모두 불러오기

    sql = "SELECT cat_id,cat_title,cat_access FROM category WHERE user_num=?";
    catResult = await db.Query(sql, [toNum]);

    let todoData = setTodoArray(endDate, catResult.length, todoResult); // todoArray 생성
    return todoData;
  }
};
