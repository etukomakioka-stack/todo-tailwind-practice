"use strict";

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

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "削除";

const backBtn = document.createElement("button");
backBtn.textContent = "戻る";

const completeBtn = document.createElement("button");
completeBtn.textContent = "完了";

    menu.appendChild(deleteBtn);
    menu.appendChild(backBtn);
    menu.appendChild(completeBtn);
    list.appendChild(menu);
    

    //menu
    list.addEventListener("click", function () {
    menu.classList.remove("hidden");
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
});

  //完了
completeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    list.classList.toggle("completed");
    menu.classList.add("hidden");
});

todoinput.value = "";
});