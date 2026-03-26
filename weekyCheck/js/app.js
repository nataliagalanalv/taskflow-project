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

/**
 * Updates the statistics display showing total, pending, and completed tasks
 * @async
 * @returns {void}
 */
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

/**
 * Deletes a task by its ID from the tasks array
 * @param {number} id - The unique identifier of the task to delete
 * @returns {void}
 */
const deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    renderAllTasks();
};

/**
 * Toggles the completion status of a task
 * @param {number} id - The unique identifier of the task to toggle
 * @returns {void}
 */
const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    saveTasks(tasks);
    renderAllTasks();
};

/**
 * Edits the title of an existing task
 * @param {number} id - The unique identifier of the task to edit
 * @returns {void}
 */
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

/**
 * Filters tasks based on current filter settings, search text, priority, and type
 * @returns {Array} Array of filtered task objects
 */
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

/**
 * Renders a single task item by cloning the template and setting its content
 * @param {Object} task - The task object to render
 * @param {number} task.id - Unique identifier of the task
 * @param {string} task.title - Title of the task
 * @param {string} task.priority - Priority level (alta, media, baja)
 * @param {string} task.type - Type of task (personal, work, etc.)
 * @param {boolean} task.completed - Completion status
 * @returns {DocumentFragment} Cloned template with task data
 */
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

/**
 * Renders all filtered tasks in the task list and updates statistics
 * @returns {void}
 */
function renderAllTasks() {
    taskList.innerHTML = '';

    const filteredTasks = getFilteredTasks();
    filteredTasks.forEach(task => {
        taskList.appendChild(renderTaskItem(task));
    });

    updateStats();

}

/**
 * Handles click events on task list items for edit, delete, and complete actions
 * @param {Event} event - The click event object
 * @returns {void}
 */
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

/**
 * Handles form submission for creating new tasks
 * @param {Event} e - The form submit event
 * @returns {void}
 */
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

/**
 * Marks all tasks as completed
 * @returns {void}
 */
const handleMarkAllCompleted = () => {
    tasks.forEach(taskItem => taskItem.completed = true);
    renderAllTasks();
    saveTasks(tasks);
};

/**
 * Deletes all completed tasks from the tasks array
 * @returns {void}
 */
const handleDeleteAllCompleted = () => {
    tasks = tasks.filter(taskItem => !taskItem.completed);
    renderAllTasks();
    saveTasks(tasks);
};

/**
 * Sets the visual active state of a filter button
 * @param {HTMLElement} filterButton - The button element to update
 * @param {boolean} isActive - Whether the button should be in active state
 * @returns {void}
 */
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

/**
 * Synchronizes all filter buttons to reflect the current filter state
 * @returns {void}
 */
const syncFilterButtonsUI = () => {
    buttons.forEach(filterButton => {
        setFilterButtonActiveState(filterButton, filterButton.dataset.filter === currentFilter);
    });
};

/**
 * Handles click events on filter buttons to change the current filter
 * @param {HTMLElement} filterButton - The clicked filter button
 * @returns {void}
 */
const handleFilterButtonClick = (filterButton) => {
    currentFilter = filterButton.dataset.filter;
    syncFilterButtonsUI();
    renderAllTasks(); 
};

/**
 * Handles search input changes and triggers task re-rendering
 * @returns {void}
 */
const handleSearchInput = () => renderAllTasks();


/**
 * Handles filter dropdown changes and triggers task re-rendering
 * @returns {void}
 */
const handleFilterChange = () => renderAllTasks();


/**
 * Toggles the application between light and dark themes
 * @returns {void}
 */
const toggleDarkMode = () => {
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');

    saveTheme(isDark ? 'dark' : 'light');

    if (btnToggleDark) btnToggleDark.innerText = isDark ? '☀️' : '🌙';
    renderAllTasks(); 
};

/**
 * Applies the previously saved theme preference to the application
 * @returns {void}
 */
const applySavedTheme = () => {
    if (loadTheme() === 'dark') {
        htmlElement.classList.add('dark');
        if (btnToggleDark) btnToggleDark.innerText = '☀️';
    }
};

/**
 * Binds all UI event listeners to their respective handlers
 * @returns {void}
 */
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

/**
 * Initializes the application by loading theme, binding events, and rendering tasks
 * @returns {void}
 */
const init = () => {
    applySavedTheme();
    tasks = loadTasks();
    bindUIEvents();
    syncFilterButtonsUI();
    renderAllTasks();
};

init();
