const todoinput = document.getElementById("todo-input");
const addbutton = document.getElementById("add-button");
const todolist = document.getElementById("todo-list");
const flower = document.getElementById("flower");
const messageBox = document.getElementById("flower-message");

/* ===== 今日の日付 ===== */
function getToday() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/* ===== 0時までのミリ秒 ===== */
function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

/* ===== 0時リセット ===== */
function resetAtMidnight() {
  setTimeout(() => {
    // Todo全削除
    todolist.innerHTML = "";

    // 保存データ削除
    localStorage.removeItem("todos");

    // 花を最初に戻す
    flower.textContent = "🌱";

    // 次の日の0時もセット
    resetAtMidnight();
  }, msUntilMidnight());
}

/* ===== Todo 作成 ===== */
function createTodo(textValue, isCompleted = false) {
  const list = document.createElement("li");
  list.classList.add("todo-item");
  if (isCompleted) list.classList.add("completed");
  todolist.appendChild(list);

  const text = document.createElement("span");
  text.classList.add("text");
  text.textContent = textValue;
  list.appendChild(text);

  const menu = document.createElement("div");
  menu.classList.add("todo-menu", "hidden");

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "完了";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "削除";

  const backBtn = document.createElement("button");
  backBtn.textContent = "戻る";

  menu.appendChild(completeBtn);
  menu.appendChild(deleteBtn);
  menu.appendChild(backBtn);
  list.appendChild(menu);

  list.addEventListener("click", () => {
    menu.classList.remove("hidden");
  });

  completeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    list.classList.toggle("completed");
    menu.classList.add("hidden");
    updateFlower();
    saveTodos();
  });

  backBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.add("hidden");
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    list.remove();
    updateFlower();
    saveTodos();
  });
}

/* ===== 追加ボタン ===== */
addbutton.addEventListener("click", () => {
  if (todoinput.value.trim() === "") return;
  createTodo(todoinput.value);
  todoinput.value = "";
  updateFlower();
  saveTodos();
});

/* ===== 花 ===== */
function updateFlower() {
  const todos = document.querySelectorAll(".todo-item");
  const completed = document.querySelectorAll(".todo-item.completed");

  let newFlower = "🌱";
  if (todos.length > 0) {
    const rate = completed.length / todos.length;
    if (rate === 1) newFlower = "💐";
    else if (rate >= 0.6) newFlower = "🌼";
    else if (rate >= 0.3) newFlower = "🪴";
  }

  if (flower.textContent !== newFlower) {
    flower.textContent = newFlower;
    flower.classList.remove("bloom");
    void flower.offsetWidth;
    flower.classList.add("bloom");
  }
}

/* ===== 花メッセージ ===== */
const flowerMessages = [
  "よくがんばってるね",
  "今日も頑張ろう！",
  "積み重ねが大切！",
  "こつこつ進めよう！",
  "少しずつでOKだよ",
  "いつもお疲れ様",
  "今日はいい調子だね",
  "無理しなくて大丈夫",
];

flower.addEventListener("click", () => {
  const index = Math.floor(Math.random() * flowerMessages.length);
  messageBox.textContent = flowerMessages[index];
  setTimeout(() => {
    messageBox.textContent = "";
  }, 3000);
});

/* ===== 保存（日付つき） ===== */
function saveTodos() {
  const todos = [];
  document.querySelectorAll(".todo-item").forEach((item) => {
    todos.push({
      text: item.querySelector(".text").textContent,
      completed: item.classList.contains("completed"),
    });
  });

  const data = {
    date: getToday(),
    todos: todos,
  };

  localStorage.setItem("todos", JSON.stringify(data));
}

/* ===== 復元（日付チェック） ===== */
function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (!saved) return;

  const data = JSON.parse(saved);

  if (data.date !== getToday()) {
    localStorage.removeItem("todos");
    return;
  }

  data.todos.forEach((todo) => {
    createTodo(todo.text, todo.completed);
  });

  updateFlower();
}

/* ===== 起動 ===== */
loadTodos();
resetAtMidnight();


