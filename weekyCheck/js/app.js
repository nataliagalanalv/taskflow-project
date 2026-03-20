// Init Listeners
const form = document.getElementById('new-task-form');
const input = document.getElementById('task');
const taskList = document.getElementById('task-list');
const template = document.getElementById('template-tarea');
const btnMarkCompleted = document.getElementById('mark-completed');

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
    const checkbox = li.querySelector('.completada');
    const span = li.querySelector('.task-description');
    const dateElem = li.querySelector('.task-date');
    const deleteBtn = li.querySelector('.delete');

    span.textContent = task.title;
    dateElem.textContent = new Date(task.createdAt).toLocaleString();
    checkbox.checked = task.completed;

// fun check completed tasks
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        updateStats();
    });

// fun delete task
    deleteBtn.addEventListener('click', () => {
        li.remove();
        tasks = tasks.filter(t => t.id !== task.id);
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

// fun create new task
const createTask = (title) => ({
    id: Date.now(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString()
});


// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderAllTasks();
    }
});

// Añadir nueva tarea
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;

    const task = createTask(title);
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