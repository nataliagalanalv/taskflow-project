// ====== Variables ======
const taskList = document.getElementById('task-list');
const template = document.getElementById('template-task');
const btnNewTask = document.getElementById('btn-new-task');
const btnMarkAllCompleted = document.getElementById('mark-all-completed');
const btnDeleteAllCompleted = document.getElementById('delete-all-completed');
const form = document.getElementById('form-container');
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

    totalSpan.textContent = total;
    pendingSpan.textContent = pending;
    completedSpan.textContent = completed;
    percentageLabel.textContent = percentage;
};

// ====== Actualizar gráfico radial ======
function updateGraphic() {
    const total = parseInt(document.getElementById('total').innerText) || 0;
    const completadas = parseInt(document.getElementById('completed').innerText) || 0;
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;

    const graphic = document.getElementById('radial-chart');
    const label = document.getElementById('percentage-label');

    if (graphic && label) {
        label.innerText = porcentaje;
        graphic.style.background = `conic-gradient(#d946ef ${porcentaje}%, #334155 0%)`;
    }
}

// Manager task (render individual task)
const managerTask = (task) => {
    const clone = template.content.cloneNode(true);
    const li = clone.querySelector('li');
    li.dataset.id = task.id;

    const titleSpan = li.querySelector('.task-description');
    titleSpan.textContent = task.title;

    li.classList.toggle('opacity-60', task.completed);
    li.classList.toggle('line-through', task.completed);

    const checkbox = li.querySelector('.select');
    checkbox.checked = task.completed;

    // Edit task
    li.querySelector('.edit-task-btn').addEventListener('click', () => {
        const newTitle = prompt('Editar tarea:', task.title);
        if (newTitle && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            renderAllTasks();
            saveTasks();
        }
    });

    // Delete task
    li.querySelector('.delete-task-btn').addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        renderAllTasks();
        saveTasks();
    });

    // Mark task as completed
    li.querySelector('.complete-task-btn').addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        task.completed = true;
        tasks.push(task);
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
    updateGraphic();
};

// Add new task button
const taskForm = document.getElementById('new-task-form'); 

taskForm.addEventListener('submit', (e) => {
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
            // Remove active state and add inactive state to all buttons
            b.classList.remove('bg-purple-600', 'text-white', 'shadow-md');
            b.classList.add('bg-gray-200', 'text-gray-700');
        });

        // Apply active state only to the clicked button
        btn.classList.remove('bg-gray-200', 'text-gray-700');
        btn.classList.add('bg-purple-600', 'text-white', 'shadow-md');

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