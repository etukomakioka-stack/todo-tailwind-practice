// 【重要】自分のAPI URLに書き換えて！最後に /todos を忘れずに。
const API_URL = "https://150saksji7.execute-api.us-east-1.amazonaws.com/todos";

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

/* ===== 1. AWSからデータを読み込む (復元) ===== */
async function loadTodos() {
  try {
    const response = await fetch(API_URL);
    const todos = await response.json();

    todolist.innerHTML = ""; // 一旦クリア

    // 今日作成されたTODOだけを表示
    const today = getToday();
    todos.forEach((todo) => {
      // API側で日付管理していない場合は全部表示
      if (!todo.date || todo.date === today) {
        createTodo(todo.text, todo.completed, todo.id);
      }
    });
    updateFlower();
  } catch (err) {
    console.error("AWSからの読み込み失敗:", err);
  }
}

/* ===== 2. AWSに保存する (追加・更新用) ===== */
async function saveToAWS(id, text, completed) {
  const data = {
    id: id || Date.now().toString(),
    text: text,
    completed: completed,
    date: getToday(),
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("AWSに保存成功！");
  } catch (err) {
    console.error("AWS保存失敗:", err);
  }
}

/* ===== Todo 作成 (引数にID追加) ===== */
function createTodo(textValue, isCompleted = false, id = null) {
  const todoId = id || Date.now().toString(); // IDがなければ新規作成

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

  // 【完了ボタン】
  completeBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    list.classList.toggle("completed");
    menu.classList.add("hidden");
    updateFlower();
    // 状態をAWSに保存
    await saveToAWS(todoId, textValue, list.classList.contains("completed"));
  });

  backBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.add("hidden");
  });

  // 【削除ボタン】
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    list.remove();
    updateFlower();
    // 削除は今のLambdaだと「上書き」で消せないので、とりあえず画面から消す運用
  });
}

// 【追加ボタン】
addbutton.addEventListener("click", async () => {
  const text = todoinput.value.trim();
  if (text === "") return;

  const newId = Date.now().toString();
  createTodo(text, false, newId);
  todoinput.value = "";
  updateFlower();

  // AWSへ送信
  await saveToAWS(newId, text, false);
});

/* ===== 花のロジック (変更なし) ===== */
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
  flower.textContent = newFlower;
}

/* ===== 起動 ===== */
loadTodos(); // 起動時にAWSから読み込む
