// Init Listeners
const form = document.getElementById('new-task-form');
const input = document.getElementById('task');
const taskList = document.getElementById('task-list');
const template = document.getElementById('template-task');
const btnMarkCompleted = document.getElementById('mark-completed');
const btnNewTask = document.getElementById('btn-new-task');
const btnDeleteTask = document.getElementById('delete-task');

const totalSpan = document.getElementById('total');
const pendingSpan = document.getElementById('pending');
const completedSpan = document.getElementById('completed');


let tasks = [];


// fun save tasks in LocalStorage
const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

// fun update stadistics
const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalSpan.textContent = total;
    pendingSpan.textContent = pending;
    completedSpan.textContent = completed;
};

// Renderizar una tarea en el DOM usando template
const renderTask = (task) => {
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector('li');
    const checkbox = li.querySelector('.select');
    const span = li.querySelector('.task-description');
    const dateElem = li.querySelector('.task-date');

    span.textContent = task.title;
    dateElem.textContent = new Date(task.createdAt).toLocaleString();
    checkbox.checked = task.completed;

// fun select tasks TODO ---------------------------
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        updateStats();
    });

// fun delete task
    btnDeleteTask.addEventListener('click', () => {
        tasks = task.filter(task => task.id !== li.dataset.id);
        li.remove();
        renderAllTasks();
        saveTasks();
        updateStats();
    });

    taskList.appendChild(li);
};

// Renderizar todas las tareas (útil al cargar)
const renderAllTasks = () => {
    taskList.innerHTML = '';
    tasks.forEach(task => renderTask(task));
    updateStats();
};

// fun init btn new task listener
btnNewTask.addEventListener('click', () => {
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        btnNewTask.textContent = 'Cancelar';
    } else {
        form.style.display = 'none';
        btnNewTask.textContent = 'Nueva tarea';
    }
});

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderAllTasks();
    }
});

// fun create new task
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const task = {
        id: Date.now(),
        title: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTask(task);
    updateStats();
    input.value = '';
});

// Marcar todas como completadas
btnMarkCompleted.addEventListener('click', () => {
    tasks.forEach(task => task.completed = true);
    renderAllTasks();
    saveTasks();
});