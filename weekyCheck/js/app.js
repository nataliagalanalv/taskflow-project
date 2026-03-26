// ====== Variables ======
const btnMarkAllCompleted = document.getElementById('mark-all-completed');
const btnDeleteAllCompleted = document.getElementById('delete-all-completed');
const searchInput = document.getElementById('search-task');

const taskList = document.getElementById('task-list');
const taskTemplate = document.getElementById('template-task'); 
const newTaskForm = document.getElementById('new-task-form'); 
const input = document.getElementById('task');

const filterPriority = document.getElementById('prioritySelect');
const filterType = document.getElementById('typeSelect');

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

    const graphic = document.getElementById('radial-chart');
    if (graphic) {
        const isDark = document.documentElement.classList.contains('dark');
        const trackColor = isDark ? '#1e293b' : '#475569';
        graphic.style.background = `conic-gradient(#d946ef ${percentage}%, ${trackColor} 0%)`;
    }
};

// ====== Task management buttons ======
const deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderAllTasks();
};

const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    saveTasks();
    renderAllTasks();
};

const editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const newTitle = prompt('Editar tarea:', task.title);
    if (newTitle && newTitle.trim() !== '') {
        task.title = newTitle.trim();
        saveTasks();
        renderAllTasks();
    }
};

// ====== Render all tasks ======
function renderAllTasks() {
    taskList.innerHTML = ''; 

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = 
            currentFilter === 'all' || 
            (currentFilter === 'completed' && task.completed) || 
            (currentFilter === 'pending' && !task.completed);
        
        const searchText = (searchInput?.value || "").toLowerCase();
        const matchesSearch =
            searchText === "" ||
            (task.title || "").toLowerCase().includes(searchText);

        const valPriority = filterPriority.value; 
        const matchesPriority = valPriority === 'all' || task.priority === valPriority;

        const valType = filterType.value;
        const matchesType = valType === 'all' || task.type === valType;

        return matchesFilter && matchesSearch && matchesPriority && matchesType;

    });

    filteredTasks.forEach(task => {
        const clone = taskTemplate.content.cloneNode(true);
        const li = clone.querySelector('li');
        
        const titleSpan = clone.querySelector('.task-description');
        const priorityBadge = clone.querySelector('.badge-priority');
        const typeBadge = clone.querySelector('.badge-type');

        if (titleSpan) titleSpan.textContent = task.title;

        if (priorityBadge) {
            priorityBadge.textContent = task.priority || 'media';
            if (task.priority === 'alta') {
                priorityBadge.className = 'badge-priority text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-red-500/20 text-red-500 border border-red-500/20';
            } else if (task.priority === 'media') {
                priorityBadge.className = 'badge-priority text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-600 border border-yellow-500/20';
            } else {
                priorityBadge.className = 'badge-priority text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-green-500/20 text-green-500 border border-green-500/20';
            }
        }

        if (typeBadge) typeBadge.textContent = task.type || 'personal';

        if (task.completed) {
            li.classList.add('opacity-50', 'line-through');
        }

        clone.querySelector('.edit-task-btn')?.addEventListener('click', () => editTask(task.id));
        clone.querySelector('.delete-task-btn')?.addEventListener('click', () => deleteTask(task.id));
        clone.querySelector('.complete-task-btn')?.addEventListener('click', () => toggleTask(task.id));

        taskList.appendChild(clone);
    });

    updateStats();

    }

    // ===== Add new task button =====
    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
    
        const priorityEl = document.getElementById('task-priority');
        const typeEl = document.getElementById('task-type');
    
        if (!text) return;

        tasks.push({
            id: Date.now(),
            title: text,
            completed: false,
            priority: priorityEl.value, 
            type: typeEl.value          
        });

        input.value = ''; 
        renderAllTasks();
        saveTasks();
    });


    // ===== Mark all tasks as completed button =====
    btnMarkAllCompleted.addEventListener('click', () => {
        tasks.forEach(t => t.completed = true);
        renderAllTasks();
        saveTasks();
    });

    // ===== Delete all completed tasks button =====
    btnDeleteAllCompleted.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        renderAllTasks();
        saveTasks();
    });

    // ===== Filter buttons =====
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

    // ===== Search input =====
    searchInput.addEventListener('input', () => renderAllTasks());

    // ===== Initialize app =====
    document.addEventListener('DOMContentLoaded', () => {
        loadTasks();
        renderAllTasks();
    });

    // ===== Toggle dark mode =====
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

    // ===== Save and load tasks from localStorage =====
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderAllTasks(); 

    // ===== Filter change events =====
    filterPriority.addEventListener('change', () => renderAllTasks());
    filterType.addEventListener('change', () => renderAllTasks());
