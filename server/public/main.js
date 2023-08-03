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

var todoData = []; // JSON 배열로, 해당 월 모든 투두 목록 저장
var clickedTodoData = []; // 현재 클릭된 일자의 투두 목록을 저장

// 날짜 format 함수
function formatDate(year, month, day) {
  // month와 day가 한 자리 수인 경우 앞에 0을 추가하여 두 자리로 만듭니다.
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  // yyyymmdd 형식의 문자열로 변환하여 반환합니다.
  return `${year}${formattedMonth}${formattedDay}`;
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
    todoData = jsonData;

    console.log("======== todoData ===========");
    console.log(todoData);
    console.log(typeof todoData);

    let todo_count = document.getElementById("todo_count");
    todo_count.innerText = todoData.length;
    resolve(todoData);
  });
}

/**
 * todoData 중에서 클릭된 날의 투두 데이터만 찾아 리턴
 * @param {*} year
 * @param {*} month
 * @param {*} date
 */
function getClickedTodoData(year, month, date) {}

/**
 * 투두 항목을 html 요소로 만들어 보여줌
 * @param {*} todoArray
 */
function addClickedTodo(todoArray) {
  var todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  for (i = 0; i < todoArray.length; i++) {
    setTodoItem(todoArray[i].todo_cont, todoArray[i].todo_id);
  }
}

//달력 생성 후 서버로부터 해당 월의 투두 목록 받아오는 함수
async function generateCalendar(year, month) {
  return new Promise(async (resolve, reject) => {
    // 현재 달력 테이블 초기화
    var calendarTable = document.getElementById("calendarTable");
    calendarTable.innerHTML = "";

    // 달력 헤더 생성
    var headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>";
    calendarTable.appendChild(headerRow);

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
          cell.onclick = function () {
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

            // clickedTodoData = getClickedTodoData(clickedYear, clickedMonth, clickedDate);
            // console.log("============== clickedTodoData ===============");
            // console.log(clickedTodoData);
            // addClickedTodo(clickedTodoData);
          };

          // if (clicked) {
          //   // 클릭된 cell이 현재 그리려는 cell과 일치하는 경우 clicked class 부여
          //   if (year === clickedYear && month + 1 === clickedMonth && date === clickedDate) {
          //     cell.className = "clicked";
          //   }
          // }
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
var today = new Date();
var tY = today.getFullYear();
var tM = today.getMonth();
const promise = generateCalendar(tY, tM);
promise.then(() => {
  // generateCalendar -> getTodoData -> setTodoData 까지 완료된 후 click 발생
  if (!clicked) {
    // 처음 페이지 로딩때 오늘 날짜에 해당하는 cell을 클릭
    let cell = document.getElementById("cal_" + formatDate(todayYear, todayMonth + 1, todayDate));
    cell.click();
  }
});

// clickedTodoData array로부터 html요소를 추가
function setTodoItem(todoText, todoId) {
  if (todoText !== "") {
    var todoList = document.getElementById("todoList");

    // 새로운 항목을 생성하여 todoList에 추가
    var newItem = document.createElement("div");
    newItem.className = "todo-item";
    newItem.id = "todo_" + todoId;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    var label = document.createElement("label");
    label.textContent = todoText;
    var deleteButton = document.createElement("span");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "X";

    deleteButton.addEventListener("click", function () {
      deleteTodoItem(newItem);
    });

    newItem.appendChild(checkbox);
    newItem.appendChild(label);
    newItem.appendChild(deleteButton);
    todoList.appendChild(newItem);
  }
}

// 투두리스트 항목 추가를 처리하는 함수
function addTodoItem() {
  var todoInput = document.getElementById("todoInput");
  var todoText = todoInput.value.trim();

  if (todoText !== "") {
    var todoList = document.getElementById("todoList");

    // 새로운 항목을 생성하여 todoList에 추가
    var newItem = document.createElement("div");
    newItem.className = "todo-item";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    var label = document.createElement("label");
    label.textContent = todoText;
    var deleteButton = document.createElement("span");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "X";

    deleteButton.addEventListener("click", function () {
      deleteTodoItem(newItem);
    });

    newItem.appendChild(checkbox);
    newItem.appendChild(label);
    newItem.appendChild(deleteButton);
    todoList.appendChild(newItem);

    // 입력 필드 초기화
    todoInput.value = "";
  }
}

function deleteTodoItem(item) {
  var todoList = document.getElementById("todoList");
  todoList.removeChild(item);
}

async function postTodoData(data) {
  const response = await fetch("http://localhost:8080/main/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// 폼 제출 이벤트 처리
document.getElementById("addForm").addEventListener(
  "submit",
  async function (e) {
    console.log("ClickedCell Date:", clickedYear, clickedMonth, clickedDate);
    e.preventDefault();
    var todoInput = document.getElementById("todoInput");
    var todoText = todoInput.value.trim();
    console.log("todoTExt:", todoText);
    // 투두 항목 추가 api 호출
    postTodoData({ todo_cont: todoText }).then((response) => {
      console.log("postTodoData res: ", response);
      addTodoItem();
    });
  },
  false
);
