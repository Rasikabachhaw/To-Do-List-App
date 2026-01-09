let selectedPriority = "low";
let currentFilter = "all";
let tasks = [];

// Priority selector
document.addEventListener("DOMContentLoaded", function () {
  const priorityButtons = document.querySelectorAll(".priority-btn");
  priorityButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      priorityButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      selectedPriority = this.dataset.priority;
    });
  });

  // Filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      filterTasks();
    });
  });

  // Enter key support
  const taskInput = document.getElementById("task");
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      AddNewTask();
    }
  });

  // Load tasks from localStorage
  loadTasks();
});

function AddNewTask() {
  const newtask = document.getElementById("task");

  if (newtask.value.trim()) {
    const task = {
      id: Date.now(),
      text: newtask.value.trim(),
      priority: selectedPriority,
      completed: false,
    };

    tasks.push(task);
    saveTasks();
    renderTask(task);
    updateStats();
    updateUI();

    newtask.value = "";
    newtask.focus();
  }
}

function renderTask(task) {
  const taskList = document.getElementById("taskList");

  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");
  taskItem.dataset.id = task.id;
  if (task.completed) {
    taskItem.classList.add("completed");
  }

  // Checkbox
  const checkbox = document.createElement("div");
  checkbox.classList.add("task-checkbox");
  checkbox.onclick = () => toggleTask(task.id);

  // Priority indicator
  const priority = document.createElement("div");
  priority.classList.add("task-priority", task.priority);

  // Task content
  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");

  const taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.innerText = task.text;

  // Actions
  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const editBtn = document.createElement("button");
  editBtn.classList.add("task-btn", "edit");
  editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
  editBtn.onclick = () => editTask(task.id);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("task-btn", "delete");
  deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
  deleteBtn.onclick = () => deleteTask(task.id);

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  taskContent.appendChild(taskText);
  taskContent.appendChild(actions);

  taskItem.appendChild(checkbox);
  taskItem.appendChild(priority);
  taskItem.appendChild(taskContent);

  taskList.appendChild(taskItem);
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    taskItem.classList.toggle("completed");
    updateStats();
    updateUI();
  }
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    const newText = prompt("Edit task:", task.text);
    if (newText && newText.trim()) {
      task.text = newText.trim();
      saveTasks();
      const taskItem = document.querySelector(`[data-id="${id}"]`);
      taskItem.querySelector(".task-text").innerText = task.text;
    }
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  const taskItem = document.querySelector(`[data-id="${id}"]`);
  taskItem.remove();
  updateStats();
  updateUI();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderAllTasks();
  updateStats();
  updateUI();
}

function filterTasks() {
  const allTasks = document.querySelectorAll(".task-item");
  allTasks.forEach((item) => {
    const id = parseInt(item.dataset.id);
    const task = tasks.find((t) => t.id === id);

    if (currentFilter === "all") {
      item.style.display = "flex";
    } else if (currentFilter === "active") {
      item.style.display = task.completed ? "none" : "flex";
    } else if (currentFilter === "completed") {
      item.style.display = task.completed ? "flex" : "none";
    }
  });
}

function updateStats() {
  const total = tasks.length;
  const active = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("activeTasks").innerText = active;
  document.getElementById("completedTasks").innerText = completed;
}

function updateUI() {
  const emptyState = document.getElementById("emptyState");
  const clearSection = document.getElementById("clearSection");
  const hasCompletedTasks = tasks.some((t) => t.completed);

  emptyState.style.display = tasks.length === 0 ? "block" : "none";
  clearSection.style.display = hasCompletedTasks ? "block" : "none";
}

function renderAllTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach((task) => renderTask(task));
  filterTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    renderAllTasks();
    updateStats();
    updateUI();
  }
}
