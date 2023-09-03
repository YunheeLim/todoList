var currentYear = null;
var currentMonth = null;

var clickedYear = null;
var clickedMonth = null;
var clickedDate = null;

var clicked = false;

var today = new Date();
var todayYear = today.getFullYear();
var todayMonth = today.getMonth();
var todayDate = today.getDate();

var todoData = []; // JSON 배열로, 해당 월 모든 투두 JSON 저장
var catData = []; // 카테고리 목록 저장

/**
 * 입력 년월일을 'yyyymmdd' 로 포맷
 * @param {*} year
 * @param {*} month
 * @param {*} day
 * @returns
 */
function formatDate(year, month, day) {
  // month와 day가 한 자리 수인 경우 앞에 0을 추가하여 두 자리로 만듭니다.
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  // yyyymmdd 형식의 문자열로 변환하여 반환합니다.
  return `${year}${formattedMonth}${formattedDay}`;
}

/**
 * mysql의 datetime 자료형을 javascript Date 객체로 변환
 * @param {*} string
 * @returns
 */
function datetimeToDate(string) {
  //string: '2022-06-01T07:26:04'
  dateString = string.split("T")[0];
  //dateString: '2022-06-01'
  date = dateString.split("-");

  let setDate = new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]));
  return setDate;
}

/**
 * 서버로부터 해당 날짜의 투두 데이터 받아옴 -> todo_count 값 갱신 -> todoData array에 저장
 * @param {*} year
 * @param {*} month
 * @returns
 */
async function getTodoData(year, month) {
  return new Promise(async (resolve, reject) => {
    var params = { userId: userId, year: year, month: month };
    const response = await fetch("http://localhost:8080/main/todo?" + new URLSearchParams(params));
    const jsonData = await response.json();
    todoData = jsonData.todo_list;

    console.log("======== todoData ===========");
    console.log(todoData);

    let todo_count = document.getElementById("todo_count");
    todo_count.innerText = jsonData.todo_count;
    resolve(todoData);
  });
}

/**
 * 서버로부터 카테고리 목록 받아옴 -> catData에 저장
 * @returns
 */
async function getCatData() {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("http://localhost:8080/main/category");
    const jsonData = await response.json();
    catData = jsonData;

    console.log("======== catData ===========");
    console.log(catData);

    resolve(catData);
  });
}

/**
 * todoCont,catId,todo_date를 post 요청 보내고 전체 투두 데이터 응답 받음, todoData 및 todo_count 업데이트
 * @param {*} todoCont
 * @param {*} catId
 * @returns
 */
async function postTodoData(todoCont, catId, year, month, day) {
  data = { cat_id: catId, todo_cont: todoCont, todo_date: { year: year, month: month, day: day } };
  const response = await fetch("http://localhost:8080/main/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const jsonData = await response.json();
  // 클라이언트의 todoData 업데이트
  todoData = jsonData.todo_list;

  // todo_count 업데이트
  let todo_count = document.getElementById("todo_count");
  todo_count.innerText = jsonData.todo_count;
  return jsonData;
}

/**
 * 서버에 투두 check / uncheck 요청 보내고 전체 투두 데이터 응답받음
 * @param {*} checked
 */
async function postTodoCheck(data) {
  const response = await fetch("http://localhost:8080/main/todo/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const jsonData = await response.json();
  // 클라이언트의 todoData 업데이트
  todoData = jsonData.todo_list;

  await displayClickedTodoData(clickedYear, clickedMonth, clickedDate);
}

/**
 * 서버에 투두 delete 요청 보내고 전체 투두 데이터 응답 받음
 * @param {*} todoId
 */
async function deleteTodoData(todoId) {}

/**
 * 클릭된 일자의 카테고리 및 투두 항목들을 보여줌
 * @param {*} year
 * @param {*} month
 * @param {*} date
 */
async function displayClickedTodoData(year, month, day) {
  return new Promise((resolve, reject) => {
    var todoList = document.getElementById("todoList");
    todoList.innerHTML = "";
    console.log("== todoList Area Initialized ==");

    //  카테고리 html 요소 생성
    catData.forEach((catItem) => {
      setCatItem(catItem.cat_id, catItem.cat_title);
    });

    // 각 카테고리별 투두 html 요소 생성
    const dayIdx = todoData.findIndex((todoItem) => todoItem.year === year && todoItem.month === month && todoItem.day === day);
    if (dayIdx != -1) {
      let clickedData = todoData[dayIdx].categorys;
      clickedData.forEach((catItem) => {
        setTodoItem(catItem.cat_id, catItem.todos);
      });
    }
    resolve(true);
  });
}

/**
 * catId,catTitle 정보로 카테고리 html 요소 생성
 * @param {*} catId
 * @param {*} catTitle
 */
function setCatItem(catId, catTitle) {
  var todoList = document.getElementById("todoList");

  var newItem = document.createElement("div");
  newItem.className = "cat-item";
  newItem.id = "cat_" + catId;

  var label = document.createElement("label");
  label.textContent = catTitle;
  var addBtn = document.createElement("span");
  addBtn.className = "cat_addBtn";
  addBtn.textContent = "+";

  // category 옆의 + 버튼 누르면 새로운 투두 입력할 수 있는 폼 보여줌
  addBtn.addEventListener("click", () => {
    displayAddTodoForm(catId);
  });

  newItem.appendChild(label);
  newItem.appendChild(addBtn);
  todoList.appendChild(newItem);
}

/**
 *  해당 날짜의 해당 카테고리에 투두 추가하는 폼 보여주기
 * @param {*} catId
 */
function displayAddTodoForm(catId) {
  var catDiv = document.getElementById("cat_" + catId);
  var addTodoFormElem = document.getElementById("addTodoForm");
  if (addTodoFormElem) {
    // 폼이 이미 있는 경우 -> 폼 요소 삭제
    catDiv.removeChild(addTodoFormElem);
    // 문제: 폼 열어둔 카테고리가 아닌 다른 카테고리의 + 버튼 누른 경우 기존 폼이 닫히고 다른 카테고리에 폼 보여야하는데 지금 그렇게 안되고 있음
  } else {
    // 폼 없는 경우 ->  폼 요소 생성
    const form = document.createElement("form");
    form.className = "add-todo-form";
    form.id = "addTodoForm";

    const input = document.createElement("input");
    input.type = "text";
    input.id = "todoContInput";
    input.placeholder = "할 일 입력";

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "추가";

    form.appendChild(input);
    form.appendChild(button);

    // 투두 추가 폼 제출 버튼 eventlistener : 서버에 post 요청
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      var todoInput = document.getElementById("todoContInput");
      var todoText = todoInput.value.trim();
      console.log("todo submit Date:", clickedYear, clickedMonth, clickedDate, " todoText:", todoText);
      if (todoText) {
        // 투두 항목 추가 api 호출
        let postResult = await postTodoData(todoText, catId, clickedYear, clickedMonth, clickedDate);
        catDiv.removeChild(form);
        console.log("=== result of postTodoData ===");
        console.log(postResult);
        await displayClickedTodoData(clickedYear, clickedMonth, clickedDate);
      }
    });

    catDiv.appendChild(form);
  }
}

/**
 * 주어진 cat_id의 하위 요소로 주어진 todos array의 투두 항목 각각의 html 요소 생성
 * @param {*} catId
 * @param {*} todos
 */
function setTodoItem(catId, todos) {
  var catDiv = document.getElementById("cat_" + catId);
  todos.forEach((todoItem) => {
    var newItem = document.createElement("div");
    newItem.className = "todo-item";
    newItem.id = "todo_" + todoItem.todo_id;

    var label = document.createElement("label");
    label.textContent = todoItem.todo_cont;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    if (todoItem.todo_checked) checkbox.checked = true;

    var editBtn = document.createElement("span");
    editBtn.className = "todo_editBtn";
    editBtn.textContent = "...";

    //투두 check 및 uncheck 처리 Listener
    checkbox.addEventListener("change", async () => {
      data = { todo_id: newItem.id.slice(5), todo_date: { year: clickedYear, month: clickedMonth } };

      if (checkbox.checked) {
        console.log(" checkbox clicked, id:", newItem.id.slice(5));

        data.checked = true;
        await postTodoCheck(data);
      } else {
        console.log(" checkbox unclicked, id:", newItem.id.slice(5));

        data.checked = false;
        await postTodoCheck(data);
      }
    });

    // 투두 옆 편집 버튼 클릭 시 수정하기, 삭제하기, 시간 알림 선택지 보여주기
    editBtn.addEventListener("click", () => {
      displayEditTodoBtns(todoItem.todo_id);
    });

    newItem.appendChild(label);
    newItem.appendChild(checkbox);
    newItem.appendChild(editBtn);
    catDiv.appendChild(newItem);
  });
}

/**
 * 해당 투두에 대한 수정, 삭제, 시간알림 추가 버튼 보여주기
 * @param {*} todoId
 */
function displayEditTodoBtns(todoId) {
  var todoDiv = document.getElementById("todo_" + todoId);
  var editTodoBtnBar = document.getElementById("editTodoBtnBar");
  if (editTodoBtnBar) {
    // 버튼 바 있는 경우 -> 삭제
    todoDiv.removeChild(editTodoBtnBar);
  } else {
    // 버튼 바 없는 경우 -> 생성
    const btnBar = document.createElement("div");
    btnBar.className = "edit-todo-bar";
    btnBar.id = "editTodoBtnBar";

    const updateBtn = document.createElement("span");
    updateBtn.className = "todo_updateBtn";
    updateBtn.textContent = "수정하기";

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "todo_deleteBtn";
    deleteBtn.textContent = "삭제하기";

    deleteBtn.addEventListener("click", async () => {
      await deleteTodoData(todoId);
    });

    const setTimeBtn = document.createElement("span");
    setTimeBtn.className = "todo_setTimeBtn";
    setTimeBtn.textContent = "시간 알림 설정";

    btnBar.appendChild(updateBtn);
    btnBar.appendChild(deleteBtn);
    btnBar.appendChild(setTimeBtn);

    todoDiv.appendChild(btnBar);
  }
}

/**
 * 해당 년월의 달력 생성 -> 서버로부터 투두 목록 받아옴 -> 첫번째 날의 cell click
 * @param {*} year
 * @param {*} month
 * @returns
 */
async function generateCalendar(year, month) {
  return new Promise(async (resolve, reject) => {
    // 현재 달력 테이블 초기화
    var calendarTable = document.getElementById("calendarTable");
    calendarTable.innerHTML = "";

    // 달력 헤더 생성
    var headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>";
    calendarTable.appendChild(headerRow);

    let catResult = await getCatData();

    // 달력 내용 생성
    var firstDay = new Date(year, month, 1);
    var startDay = firstDay.getDay();
    var lastDay = new Date(year, month + 1, 0);
    var endDate = lastDay.getDate();
    var date = 1;
    for (var i = 0; i < 6; i++) {
      var row = document.createElement("tr");
      for (var j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          var cell = document.createElement("td");
          cell.className = "unclicked";
          row.appendChild(cell);
        } else if (date > endDate) {
          break;
        } else {
          var cell = document.createElement("td");
          cell.innerText = date;
          cell.id = "cal_" + formatDate(year, month + 1, date); // cell마다 id 부여
          cell.className = "unclicked";

          // 날짜 셀에 클릭 이벤트 추가
          cell.onclick = async function () {
            // 전에 클릭된 cell의 class 변경
            clickedCell = document.getElementsByClassName("clicked");
            for (var i = 0; i < clickedCell.length; i++) {
              clickedCell[i].className = "unclicked";
            }
            this.className = "clicked"; // 현재 클릭된 날짜에 clicked class 부여
            clicked = true;

            //클릭한 날짜 정보 저장
            clickedYear = year;
            clickedMonth = month + 1;
            clickedDate = parseInt(this.innerText);

            var clickedDateText = document.getElementById("clickedDate");
            clickedDateText.innerText = clickedYear + "년" + clickedMonth + "월 " + clickedDate + "일";

            // 클릭한 날짜의 투두 목록 보여주기
            console.log("clicked event:", clickedYear, clickedMonth, clickedDate);
            clickedTodoData = await displayClickedTodoData(clickedYear, clickedMonth, clickedDate);
          };
          row.appendChild(cell);
          date++;
        }
      }

      calendarTable.appendChild(row);
      if (date > endDate) {
        break;
      }
    }

    // 이번 달 표시
    var currentMonthTitle = document.getElementById("currentMonthTitle");
    currentMonthTitle.innerText = month + 1 + "월";

    //달력 모두 생성 후 해당 월의 todo data 받아오기
    let result = await getTodoData(year, month + 1);

    if (clicked) {
      let firstCell = document.getElementById("cal_" + formatDate(year, month + 1, 1));
      firstCell.click();
    }

    resolve(result);
  });
}

function previousMonth() {
  if (currentYear === null || currentMonth === null) {
    // 현재 날짜 정보 가져오기
    var today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
  }

  // 이전 달로 변경
  currentMonth--;
  if (currentMonth < 0) {
    currentYear--;
    currentMonth = 11;
  }

  generateCalendar(currentYear, currentMonth);
}

function nextMonth() {
  if (currentYear === null || currentMonth === null) {
    // 현재 날짜 정보 가져오기
    var today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
  }

  // 다음 달로 변경
  currentMonth++;
  if (currentMonth > 11) {
    currentYear++;
    currentMonth = 0;
  }

  generateCalendar(currentYear, currentMonth);
}

// 초기 달력 생성
const promise = generateCalendar(todayYear, todayMonth);
promise.then(() => {
  // generateCalendar -> getTodoData 까지 완료된 후 click 발생
  if (!clicked) {
    // 처음 페이지 로딩때 오늘 날짜에 해당하는 cell을 클릭
    let cell = document.getElementById("cal_" + formatDate(todayYear, todayMonth + 1, todayDate));
    cell.click();
  }
});
