// Init Listeners
const form = document.getElementById('new-task-form');
const input = document.getElementById('task');
const taskList = document.getElementById('task-list');
const template = document.getElementById('template-task');
const btnMarkCompleted = document.getElementById('mark-completed');
const btnNewTask = document.getElementById('btn-new-task');

const totalSpan = document.getElementById('total');
const pendingSpan = document.getElementById('pending');
const completedSpan = document.getElementById('completed');

let tasks = [];

// fun save tasks in LocalStorage
const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

// load tasks
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderAllTasks();
        updateStats();
    }
});

// render all tasks (useful when loading)
const renderAllTasks = () => {
    taskList.innerHTML = "";
    tasks.forEach(task => {
        managerTask(task);
    });
    updateStats(); 
};

// fun update statistics
const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalSpan.textContent = total;
    pendingSpan.textContent = pending;
    completedSpan.textContent = completed;
};

// fun manager tasks rendering with checkboxes and delete buttons
const managerTask = (task) => {
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector('li');

    li.dataset.id = task.id;

    li.querySelector('.task-description').textContent = task.title;
    li.querySelector('.task-date').textContent = new Date(task.createdAt).toLocaleString();
    li.querySelector('.status').textContent = task.completed ? "completed" : "pending";


    const checkbox = li.querySelector('.select');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Eliminar";
    deleteBtn.classList.add('delete-task-btn');
    li.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        li.remove();
        updateStats();
        saveTasks();
    });

    taskList.appendChild(li);
};

btnMarkCompleted.addEventListener('click', () => {
    const selectedCheckboxes = document.querySelectorAll('.select:checked');

    const ids = Array.from(selectedCheckboxes).map(cb =>
        cb.closest('li').dataset.id
    );

    tasks.forEach(task => { // mark as completed if id matches
        if (ids.includes(task.id.toString())) {
            task.completed = true;
        }
    });

    renderAllTasks();  
    updateStats();
    saveTasks();
});


const addNewTask = () => {
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
};

// fun new task form submission
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

    renderAllTasks();
    updateStats();
    saveTasks();

    input.value = "";
    form.style.display = 'none';
});

btnNewTask.addEventListener('click', addNewTask);

// fun filter tasks
const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter; // 'all', 'pending' o 'completed'
        applyFilter();
    });
});

const applyFilter = () => {
    taskList.innerHTML = '';
    let filteredTasks = tasks;

    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    filteredTasks.forEach(task => managerTask(task));
    updateStats();
};