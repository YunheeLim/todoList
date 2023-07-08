const { URL, URLSearchParams } = require('url');
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

async function getTodoData(year,month) {
  var params = {year:year, month:month}
  const response = await fetch("http://localhost:8080/main/todo?"+ new URLSearchParams(params));
  const jsonData = await response.json();
  console.log(jsonData);
  return jsonData;
}


function generateCalendar(year, month) {
  //해당 월의 투두 데이터 받아오기
  

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
        cell.className="unclicked"
        row.appendChild(cell);
      } else if (date > endDate) {
        break;
      } else {
        var cell = document.createElement("td");
        cell.innerText = date;
        cell.className="unclicked"
        // 날짜 셀에 클릭 이벤트 추가
        cell.onclick = function () {
          // 전에 클릭된 cell의 class 변경
          clickedCell=document.getElementsByClassName("clicked");
          for(var i=0;i<clickedCell.length;i++){
            clickedCell[i].className="unclicked";
          }


          // 현재 클릭된 날짜에 clicked class 부여
          this.className = "clicked";
          clicked=true;

          //클릭한 날짜 정보 저장
          clickedYear=year;
          clickedMonth=month+1;
          clickedDate=parseInt(this.innerText);
        };

        if(clicked){ // 클릭된 cell이 현재 그리려는 cell과 일치하는 경우 clicked class 부여
          if(year === clickedYear && month+1 === clickedMonth && date === clickedDate){
            cell.className="clicked";
          }
        }

        row.appendChild(cell);

        if(!clicked){ // 처음 페이지 로딩때
          if (year === todayYear && month === todayMonth && date === todayDate) {
            cell.click();
          }
        }
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
  currentMonthTitle.innerText = (month + 1) + "월";

  getTodoData(year,month);

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

generateCalendar(tY, tM);



// 투두리스트 항목 추가를 처리하는 함수
function addTodoItem() {
  var todoInput = document.getElementById('todoInput');
  var todoText = todoInput.value.trim();

  if (todoText !== '') {
    var todoList = document.getElementById('todoList');

    // 새로운 항목을 생성하여 todoList에 추가
    var newItem = document.createElement('div');
    newItem.className = 'todo-item';

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    var label = document.createElement('label');
    label.textContent = todoText;
    var deleteButton = document.createElement('span');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'X';

    deleteButton.addEventListener('click', function () {
      deleteTodoItem(newItem);
    });

    newItem.appendChild(checkbox);
    newItem.appendChild(label);
    newItem.appendChild(deleteButton);
    todoList.appendChild(newItem);

    // 입력 필드 초기화
    todoInput.value = '';
  }
}

function deleteTodoItem(item) {
  var todoList = document.getElementById('todoList');
  todoList.removeChild(item);
}

// 폼 제출 이벤트 처리
document.getElementById('addForm').addEventListener('submit', function (e) {
  console.log("ClickedCell Date:", clickedYear,clickedMonth,clickedDate);
  e.preventDefault();
  addTodoItem();
},false);

