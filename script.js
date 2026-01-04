

const todoinput = document.getElementById("todo-input");
const addbutton = document.getElementById("add-button");
const todolist = document.getElementById("todo-list");

addbutton.addEventListener("click", function () {
if (todoinput.value.trim() === "") {
    return;
}


  // li 作成
const list = document.createElement("li");
list.classList.add("todo-item");
todolist.appendChild(list);

  // text
const text = document.createElement("span");
text.classList.add("text");
text.textContent = todoinput.value;
list.appendChild(text);

  // menu
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
    

    //menu
    list.addEventListener("click", function () {
    menu.classList.remove("hidden");
});

//完了
completeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    list.classList.toggle("completed");
    menu.classList.add("hidden"); 
    updateFlower();
    });


  // 戻る
backBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    menu.classList.add("hidden");
});

  // 削除
deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    list.remove();
    updateFlower();
});


todoinput.value = "";
});

const flower = document.getElementById("flower");


// 割合に応じて花を変える
function updateFlower() {
  const todos = document.querySelectorAll(".todo-item");
  const completed = document.querySelectorAll(".todo-item.completed");

  if (todos.length === 0) {
    flower.textContent = "🌱";
    return;
  }

  const rate = completed.length / todos.length;

  if (rate === 1) {
    flower.textContent = "💐";
  } else if (rate >= 0.6) {
    flower.textContent = "🌼";
  } else if (rate >= 0.3) {
    flower.textContent = "🪴";
  } else {
    flower.textContent = "🌱";
  }
}

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

const messageBox = document.getElementById("flower-message");

function getRandomMessage() {
  const index = Math.floor(Math.random() * flowerMessages.length);
  return flowerMessages[index];
}

flower.addEventListener("click", function () {
  messageBox.textContent = getRandomMessage();
  setTimeout(() => {
  messageBox.textContent = "";
}, 3000);

});
