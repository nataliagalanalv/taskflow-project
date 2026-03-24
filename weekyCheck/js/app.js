// ====== Variables ======
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('new-task-form'); 
const template = document.getElementById('template-task');
const btnMarkAllCompleted = document.getElementById('mark-all-completed');
const btnDeleteAllCompleted = document.getElementById('delete-all-completed');
const input = document.getElementById('task');
const searchInput = document.getElementById('search-task');

const totalSpan = document.getElementById('total');
const pendingSpan = document.getElementById('pending');
const completedSpan = document.getElementById('completed');
const percentageLabel = document.getElementById('percentage-label');

let tasks = [];
let currentFilter = 'all';

// ====== LocalStorage ======
const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));
const loadTasks = () => {
    const saved = localStorage.getItem('tasks');
    if (saved) tasks = JSON.parse(saved);
};

// ====== Statistics ======
const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (totalSpan) totalSpan.textContent = total;
    if (pendingSpan) pendingSpan.textContent = pending;
    if (completedSpan) completedSpan.textContent = completed;
    if (percentageLabel) percentageLabel.textContent = percentage;

    // Actualizar gráfico radial directamente aquí para asegurar sincronía
    const graphic = document.getElementById('radial-chart');
    if (graphic) {
        const isDark = document.documentElement.classList.contains('dark');
        const trackColor = isDark ? '#1e293b' : '#475569';
        graphic.style.background = `conic-gradient(#d946ef ${percentage}%, ${trackColor} 0%)`;
    }
};

// ====== Manager task (render individual task) ======
const managerTask = (task) => {
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector('li');
    
    const titleSpan = li.querySelector('.task-description');
    const checkbox = li.querySelector('.select');
    const btnEdit = li.querySelector('.edit-task-btn');
    const btnDelete = li.querySelector('.delete-task-btn');
    const btnComplete = li.querySelector('.complete-task-btn');

    titleSpan.textContent = task.title;
    checkbox.checked = task.completed;

     if (task.completed) {
        li.classList.add('opacity-50', 'line-through', 'bg-gray-100', 'dark:bg-gray-800/40');
        if(btnComplete) btnComplete.classList.add('hidden');
    }

    btnEdit.addEventListener('click', () => {
        const newTitle = prompt('Editar tarea:', task.title);
        if (newTitle && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            renderAllTasks();
            saveTasks();
        }
    });

    btnDelete.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        renderAllTasks();
        saveTasks();
    });

    if (btnComplete) {
        btnComplete.addEventListener('click', () => {
            task.completed = true;
            renderAllTasks();
            saveTasks();
        });
    }

    taskList.appendChild(li);
};

// ====== Renderizar todas las tareas ======
const renderAllTasks = () => {
    if (!taskList) return;
    taskList.innerHTML = '';

    let filteredTasks = tasks;

    if (currentFilter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    const searchText = searchInput.value.toLowerCase();
    if (searchText) {
        filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(searchText));
    }

    filteredTasks.forEach(task => managerTask(task));
    updateStats();
};

// Add new task button
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        title: text,
        completed: false
    });

    input.value = ''; 
    renderAllTasks();
    saveTasks();
});


// Button mark all tasks as completed
btnMarkAllCompleted.addEventListener('click', () => {
    tasks.forEach(t => t.completed = true);
    renderAllTasks();
    saveTasks();
});

// Button delete all completed tasks
btnDeleteAllCompleted.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    renderAllTasks();
    saveTasks();
});

// Filter buttons
const buttons = document.querySelectorAll('.filter-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        
        buttons.forEach(b => {
            b.classList.remove('bg-purple-600', 'dark:bg-fuchsia-600', 'text-white', 'shadow-md');
            b.classList.add('text-slate-600', 'dark:text-slate-400');
            b.style.backgroundColor = ""; 
        });

        btn.classList.add('bg-purple-600', 'dark:bg-fuchsia-600', 'text-white', 'shadow-md');
        btn.classList.remove('text-slate-600', 'dark:text-slate-400');

        currentFilter = btn.dataset.filter;
        renderAllTasks(); 
    });
});

// Search input
searchInput.addEventListener('input', () => renderAllTasks());

// Inicialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderAllTasks();
});

// Función para cambiar el modo
const btnToggleDark = document.getElementById('toggle-dark');
const htmlElement = document.documentElement;

const toggleDarkMode = () => {
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    btnToggleDark.innerText = isDark ? '☀️' : '🌙';
    renderAllTasks(); 
};

btnToggleDark.addEventListener('click', toggleDarkMode);

if (localStorage.getItem('theme') === 'dark') {
    htmlElement.classList.add('dark');
    if (btnToggleDark) btnToggleDark.innerText = '☀️';
}
