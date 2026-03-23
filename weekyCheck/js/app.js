// ====== Variables ======
const taskList = document.getElementById('task-list');
const template = document.getElementById('template-task');
const btnNewTask = document.getElementById('btn-new-task');
const btnMarkCompleted = document.getElementById('mark-completed');
const btnMarkAllCompleted = document.getElementById('mark-all-completed');
const btnDeleteAllCompleted = document.getElementById('delete-all-completed');
const form = document.getElementById('form-container');
const input = document.getElementById('task');
const searchInput = document.getElementById('search-task');

const totalSpan = document.getElementById('total');
const pendingSpan = document.getElementById('pending');
const completedSpan = document.getElementById('completed');

let tasks = [];
let currentFilter = 'all';

// ====== LocalStorage ======
const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));
const loadTasks = () => {
    const saved = localStorage.getItem('tasks');
    if (saved) tasks = JSON.parse(saved);
};

// ====== Estadísticas ======
const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalSpan.textContent = total;
    pendingSpan.textContent = pending;
    completedSpan.textContent = completed;
};

// ====== Renderizar tarea ======
const managerTask = (task) => {
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector('li');
    li.dataset.id = task.id;

    const titleSpan = li.querySelector('.task-description');
    titleSpan.textContent = task.title;

    // Aplicar estilo difuminado si está completada
    li.classList.toggle('opacity-60', task.completed);
    li.classList.toggle('line-through', task.completed);

    const checkbox = li.querySelector('.select');
    checkbox.checked = task.completed;

    // Editar tarea
    li.querySelector('.edit-task-btn').addEventListener('click', () => {
        const newTitle = prompt('Editar tarea:', task.title);
        if (newTitle && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            renderAllTasks();
            saveTasks();
        }
    });

    // Eliminar tarea
    li.querySelector('.delete-task-btn').addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        renderAllTasks();
        saveTasks();
    });

    taskList.appendChild(li);
};

// ====== Renderizar todas las tareas ======
const renderAllTasks = () => {
    taskList.innerHTML = '';

    let filteredTasks = tasks;

    // Aplicar filtro
    if (currentFilter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    // Aplicar búsqueda
    const searchText = searchInput.value.toLowerCase();
    if (searchText) filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(searchText));

    filteredTasks.forEach(task => managerTask(task));
    updateStats();
};

// ====== Listeners ======

// Mostrar/ocultar formulario
btnNewTask.addEventListener('click', () => {
    form.classList.toggle('hidden'); // alterna la visibilidad
});

// Agregar nueva tarea
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        title: text,
        completed: false,
        createdAt: new Date().toISOString()
    });

    input.value = '';
    form.style.display = 'none';
    renderAllTasks();
    saveTasks();
});

// Botón marcar seleccionadas completadas
btnMarkCompleted.addEventListener('click', () => {
    const selectedCheckboxes = document.querySelectorAll('.select:checked');
    const ids = Array.from(selectedCheckboxes).map(cb => cb.closest('li').dataset.id);

    tasks.forEach(t => {
        if (ids.includes(t.id.toString())) t.completed = true;
    });

    renderAllTasks();
    saveTasks();
});

// Botón marcar todas completadas
btnMarkAllCompleted.addEventListener('click', () => {
    tasks.forEach(t => t.completed = true);
    renderAllTasks();
    saveTasks();
});

// Botón eliminar todas completadas
btnDeleteAllCompleted.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    renderAllTasks();
    saveTasks();
});

// Filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        renderAllTasks();
    });
});

// Búsqueda
searchInput.addEventListener('input', () => renderAllTasks());

// ====== Inicializar ======
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderAllTasks();
});