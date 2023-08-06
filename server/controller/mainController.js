const todoModel = require("../models/todoModel.js");
const userModel = require("../models/userModel.js");

/**
 * 대상 회원의 해당 년월 투두 목록을 불러옴
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.getMonthlyTodo = async (req, res) => {
  let fromNum = req.session.userNum;
  let toId = req.query.userId;
  let year = req.query.year;
  let month = req.query.month;
  if (fromNum == undefined) {
    // 세션 만료된 경우
    return { msg: "session expired." };
  }
  console.log("-- GET monthly todo -- from:", req.session.userId, ", to: ", toId, "date: ", year, month);

  let toNum = await userModel.findUserNumById(toId);

  // 본인의 투두 목록 조회 시: category access 따지지 않아도 됨
  if (fromNum === toNum) {
    let getTodoResult = await todoModel.getMonthTodo(toNum, year, month);
    console.log("========todoResult============");
    console.log(getTodoResult);
    return getTodoResult;
  }
};

/**
 * 회원이 가진 카테고리 목록 불러옴
 * @param {*} req
 * @param {*} res
 */
module.exports.getCategory = async (req, res) => {
  console.log("-- GET category -- from:", req.session.userId);
  let catResult = await todoModel.getCategories(req.session.userNum);
  console.log("=============catResult==================");
  console.log(catResult);
  return catResult;
};

/**
 * db에 투두 데이터 추가한 뒤 해당 데이터+카테고리 정보 함께 리턴
 * @param {*} req
 * @param {*} res
 */
module.exports.insertTodo = async (req, res) => {
  let userNum = req.session.userNum;
  if (userNum == undefined) {
    return { msg: "session expired." };
  }
  let catId = req.body.cat_id;
  let todoCont = req.body.todo_cont;
  let { year, month, day } = req.body.todo_date;
  console.log(" -- POST todo -- from user_num: ", userNum, "cat_id: ", catId, " cont: ", todoCont, " date: ", year, month, day);
  let insertResult = await todoModel.insertTodoData(userNum, catId, todoCont, req.body.todo_date);
  console.log("=============insertResult==============");
  console.log(insertResult);
  return insertResult;
};
