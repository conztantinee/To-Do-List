const form = document.getElementById("new-todo-form"),
  input = document.getElementById("new-todo-title"),
  states = ["active", "inactive", "done"],
  tabs = ["all"].concat(states),
  buttons = [
    { action: "done", icon: "ok" },
    { action: "active", icon: "plus" },
    { action: "inactive", icon: "minus" },
    { action: "remove", icon: "trash" }
  ];

let currentTab = "all";
let todos = localStorage.getItem('localAppData') ?
  JSON.parse(localStorage.getItem('localAppData')) : [];

const setLocal = () => {
  todos = todos.sort((a, b) => b.number - a.number)

  localStorage.setItem('localAppData', JSON.stringify(todos));
};

const allCountTodos = () => {
  const allCount = document.querySelector("[data-tab-name='all']").querySelector("span");
  const activeCount = document.querySelector("[data-tab-name='active']").querySelector("span");
  const inactiveCount = document.querySelector("[data-tab-name='inactive']").querySelector("span");
  const doneCount = document.querySelector("[data-tab-name='done']").querySelector("span");
  const one = 1;

  let activeNumber = 0;
  let inactiveNumber = 0;
  let doneNumber = 0;

  todos.forEach((item) => {
    if (item.state === 'active') activeNumber += one;
    if (item.state === 'inactive') inactiveNumber += one;
    if (item.state === 'done') doneNumber += one;
  });

  allCount.textContent = todos.length;
  inactiveCount.textContent = inactiveNumber;
  doneCount.textContent = doneNumber;
  activeCount.textContent = activeNumber;
};

const renderTodos = () => {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";
  todos
    .filter((todo) => todo.state === currentTab || currentTab === "all")
    .forEach((todo) => {
      const div1 = document.createElement("div");
      div1.className = "row";

      const div2 = document.createElement("div");
      div2.innerHTML =
        '<a class="list-group-item" href="#">' + todo.name + "</a>";
      div2.className = "col-xs-6 col-sm-9 col-md-10";

      const div3 = document.createElement("div");
      div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";

      const up = document.createElement("button");
      const down = document.createElement("button");
      up.className = "arrow-up btn btn-default btn-xs";
      down.className = "arrow-down btn btn-default btn-xs";
      up.innerHTML = '<i class="glyphicon glyphicon-arrow-up"></i>';
      down.innerHTML = '<i class="glyphicon glyphicon-arrow-down"></i>';
      div3.appendChild(up);
      div3.appendChild(down);


      buttons.forEach((button) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-default btn-xs";
        btn.innerHTML =
          '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
        div3.appendChild(btn);

        if (button.action === todo.state) {
          btn.disabled = true;
        }

        if (button.action === "remove") {
          btn.title = "Remove";
          btn.onclick = () => {
            if (
              confirm(
                "Are you sure you want to delete the item titled " + todo.name
              )
            ) {
              todos.splice(todos.indexOf(todo), 1);
              renderTodos();
            }
          };
        } else {
          btn.title = "Mark as " + button.action;
          btn.onclick = () => {
            todo.state = button.action;
            renderTodos();
          };
        }
      });

      div1.appendChild(div2);
      div1.appendChild(div3);

      todoList.appendChild(div1);
    });
  upAndDownButton();
  setLocal();
  allCountTodos();
}

const selectTab = (element) => {
  const tabName = element.attributes["data-tab-name"].value;
  currentTab = tabName;
  const todoTabs = document.getElementsByClassName("todo-tab");
  for (let i = 0; i < todoTabs.length; i++) {
    todoTabs[i].classList.remove("active");
  }
  element.classList.add("active");
  renderTodos();
}

const addTodo = () => {
  todos.push({
    name: input.value,
    state: 'active'
  });

  input.value = "";

  renderTodos();
}

const upAndDownButton = () => {
  const upLink = document.querySelectorAll(".arrow-up");
  const downLink = document.querySelectorAll(".arrow-down");

  upLink.forEach(element => {
    element.addEventListener('click', function () {
      const wrapper = this.parentElement.parentElement;
      const name = wrapper.firstChild.firstChild.textContent;

      if (wrapper.previousElementSibling) {
        wrapper.parentNode.insertBefore(wrapper, wrapper.previousElementSibling);

        todos.forEach(item => {
          if (item.name === name) {
            item.number = item.number - 1;

            console.log(item);
          }
        });
      }
    });
  });

  downLink.forEach(element => {
    element.addEventListener('click', function () {
      const wrapper = this.parentElement.parentElement;
      const name = wrapper.firstChild.firstChild.textContent;

      if (wrapper.nextElementSibling) {
        wrapper.parentNode.insertBefore(wrapper.nextElementSibling, wrapper);

        todos.forEach(item => {
          if (item.name === name) {
            item.number = item.number + 1;

            console.log(item);
          }
        });
      }
    });
  });

  setLocal();
};

form.addEventListener('click', (event) => {
  event.preventDefault();
  if (input.value && input.value.length) addTodo();
});

renderTodos();