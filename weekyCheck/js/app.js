// ====== Variables ======
import { loadTasks, saveTasks, loadTheme, saveTheme } from './services/db.js';
import { validateNewTask } from './utils/validations.js';

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
const btnToggleDark = document.getElementById('toggle-dark');
const htmlElement = document.documentElement;
const buttons = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';

const PRIORITY_CLASS_BY_VALUE = {
    alta: 'badge-priority text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-red-500/20 text-red-500 border border-red-500/20',
    media: 'badge-priority text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-600 border border-yellow-500/20',
    baja: 'badge-priority text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-green-500/20 text-green-500 border border-green-500/20',
};

const FILTER_ACTIVE_CLASSES = ['bg-purple-600', 'dark:bg-fuchsia-600', 'text-white', 'shadow-md'];
const FILTER_INACTIVE_CLASSES = ['text-slate-600', 'dark:text-slate-400'];

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
    saveTasks(tasks);
    renderAllTasks();
};

const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    saveTasks(tasks);
    renderAllTasks();
};

const editTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newTitle = prompt('Editar tarea:', task.title);
    if (newTitle && newTitle.trim() !== '') {
        task.title = newTitle.trim();
        saveTasks(tasks);
        renderAllTasks();
    }
};

// ====== Render all tasks ======
const getFilteredTasks = () => {
    const searchText = (searchInput?.value || "").toLowerCase();
    const valPriority = filterPriority.value;
    const valType = filterType.value;

    return tasks.filter(task => {
        const matchesFilter =
            currentFilter === 'all' ||
            (currentFilter === 'completed' && task.completed) ||
            (currentFilter === 'pending' && !task.completed);

        const matchesSearch =
            searchText === "" ||
            (task.title || "").toLowerCase().includes(searchText);
        const matchesPriority = valPriority === 'all' || task.priority === valPriority;
        const matchesType = valType === 'all' || task.type === valType;

        return matchesFilter && matchesSearch && matchesPriority && matchesType;
    });
};

const renderTaskItem = (task) => {
    const clone = taskTemplate.content.cloneNode(true);
    const li = clone.querySelector('li');

    if (li) li.dataset.taskId = String(task.id);

    const titleSpan = clone.querySelector('.task-description');
    const priorityBadge = clone.querySelector('.badge-priority');
    const typeBadge = clone.querySelector('.badge-type');

    if (titleSpan) titleSpan.textContent = task.title;

    if (priorityBadge) {
        priorityBadge.textContent = task.priority || 'media';
        priorityBadge.className = PRIORITY_CLASS_BY_VALUE[task.priority] || PRIORITY_CLASS_BY_VALUE.media;
    }

    if (typeBadge) typeBadge.textContent = task.type || 'personal';

    if (task.completed && li) {
        li.classList.add('opacity-50');
        const titleSpan = li.querySelector('.task-description');
        if (titleSpan) {
            titleSpan.classList.add('line-through');
        }
    }

    return clone;
};

function renderAllTasks() {
    taskList.innerHTML = '';

    const filteredTasks = getFilteredTasks();
    filteredTasks.forEach(task => {
        taskList.appendChild(renderTaskItem(task));
    });

    updateStats();

}

const handleTaskListClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const actionButton = target.closest('.edit-task-btn, .delete-task-btn, .complete-task-btn');
    if (!actionButton) return;

    const taskItem = actionButton.closest('li[data-task-id]');
    if (!taskItem) return;

    const taskId = Number(taskItem.dataset.taskId);
    if (Number.isNaN(taskId)) return;

    if (actionButton.classList.contains('edit-task-btn')) {
        editTask(taskId);
        return;
    }
    if (actionButton.classList.contains('delete-task-btn')) {
        deleteTask(taskId);
        return;
    }
    if (actionButton.classList.contains('complete-task-btn')) {
        toggleTask(taskId);
    }
};

const handleNewTaskSubmit = (e) => {
    e.preventDefault();

    const priorityEl = document.getElementById('task-priority');
    const typeEl = document.getElementById('task-type');

    const validation = validateNewTask({
        title: input?.value,
        priority: priorityEl?.value,
        type: typeEl?.value,
    });

    if (!validation.ok) return;

    tasks.push({
        id: Date.now(),
        title: validation.value.title,
        completed: false,
        priority: validation.value.priority,
        type: validation.value.type,
    });

    input.value = '';
    renderAllTasks();
    saveTasks(tasks);
};

const handleMarkAllCompleted = () => {
    tasks.forEach(taskItem => taskItem.completed = true);
    renderAllTasks();
    saveTasks(tasks);
};

const handleDeleteAllCompleted = () => {
    tasks = tasks.filter(taskItem => !taskItem.completed);
    renderAllTasks();
    saveTasks(tasks);
};

const setFilterButtonActiveState = (filterButton, isActive) => {
    filterButton.classList.remove(...FILTER_ACTIVE_CLASSES, ...FILTER_INACTIVE_CLASSES);
    if (isActive) {
        filterButton.classList.add(...FILTER_ACTIVE_CLASSES);
    } else {
        filterButton.classList.add(...FILTER_INACTIVE_CLASSES);
    }
    filterButton.style.backgroundColor = "";
    filterButton.dataset.active = isActive ? 'true' : 'false';
    filterButton.setAttribute('aria-selected', isActive ? 'true' : 'false');
};

const syncFilterButtonsUI = () => {
    buttons.forEach(filterButton => {
        setFilterButtonActiveState(filterButton, filterButton.dataset.filter === currentFilter);
    });
};

const handleFilterButtonClick = (filterButton) => {
    currentFilter = filterButton.dataset.filter;
    syncFilterButtonsUI();
    renderAllTasks(); 
};

const handleSearchInput = () => renderAllTasks();

const handleFilterChange = () => renderAllTasks();

const toggleDarkMode = () => {
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');

    saveTheme(isDark ? 'dark' : 'light');

    if (btnToggleDark) btnToggleDark.innerText = isDark ? '☀️' : '🌙';
    renderAllTasks(); 
};

const applySavedTheme = () => {
    if (loadTheme() === 'dark') {
        htmlElement.classList.add('dark');
        if (btnToggleDark) btnToggleDark.innerText = '☀️';
    }
};

const bindUIEvents = () => {
    taskList.addEventListener('click', handleTaskListClick);
    newTaskForm.addEventListener('submit', handleNewTaskSubmit);
    btnMarkAllCompleted.addEventListener('click', handleMarkAllCompleted);
    btnDeleteAllCompleted.addEventListener('click', handleDeleteAllCompleted);
    searchInput.addEventListener('input', handleSearchInput);
    filterPriority.addEventListener('change', handleFilterChange);
    filterType.addEventListener('change', handleFilterChange);
    btnToggleDark?.addEventListener('click', toggleDarkMode);

    buttons.forEach(filterButton => {
        filterButton.addEventListener('click', () => {
            handleFilterButtonClick(filterButton);
        });
    });
};

const init = () => {
    applySavedTheme();
    tasks = loadTasks();
    bindUIEvents();
    syncFilterButtonsUI();
    renderAllTasks();
};

init();
