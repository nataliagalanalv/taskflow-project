/**
 * FocusMode - Componente para el modo de enfoque
 * Muestra una interfaz inmersiva centrada en la tarea de prioridad Alta más reciente
 */

export class FocusMode {
  constructor(taskCollection, taskController) {
    this.taskCollection = taskCollection;
    this.taskController = taskController;
    this.isActive = false;
    this.focusOverlay = null;
    this.focusContent = null;
    this.currentFocusTask = null;
    
    // Elementos DOM
    this.btn = null;
    this.appContainer = null;
    this.timerDisplay = null;
  }

  /**
   * Initialize DOM references
   */
  initDOMReferences() {
    this.btn = document.getElementById('focus-mode-btn');
    this.appContainer = document.getElementById('app-container');
    this.timerDisplay = document.getElementById('timer-display');
  }

  /**
   * Create the focus mode overlay HTML structure
   */
  createFocusOverlay() {
    // Crear contenedor overlay que cubre toda la pantalla
    this.focusOverlay = document.createElement('div');
    this.focusOverlay.id = 'focus-overlay';
    this.focusOverlay.className = 'fixed inset-0 z-50 bg-[#020617] opacity-0 pointer-events-none transition-opacity duration-700';
    
    // Botón de salida en la esquina superior derecha
    const exitBtn = document.createElement('button');
    exitBtn.className = 'fixed top-8 right-8 z-50 p-3 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all hover:scale-110 border border-white/20';
    exitBtn.innerHTML = '✕';
    exitBtn.title = 'Salir del Modo Enfoque';
    exitBtn.addEventListener('click', () => this.deactivate());
    this.focusOverlay.appendChild(exitBtn);
    
    // Contenedor principal centrado
    this.focusContent = document.createElement('div');
    this.focusContent.className = 'flex items-center justify-center min-h-screen w-full p-8';
    this.focusOverlay.appendChild(this.focusContent);
    
    document.body.appendChild(this.focusOverlay);
  }

  /**
   * Render the focused task card
   * @param {Object} task - The task to display
   */
  renderFocusTask(task) {
    if (!this.focusContent) return;
    
    this.currentFocusTask = task;
    
    // Limpiar contenido previo
    this.focusContent.innerHTML = '';
    
    // Crear tarjeta grande centrada
    const card = document.createElement('div');
    card.className = 'max-w-3xl w-full bg-white/5 backdrop-blur-xl border-2 border-fuchsia-500/50 rounded-3xl p-12 shadow-[0_0_60px_rgba(217,70,239,0.3)] relative overflow-hidden';
    
    // Efecto de brillo de fondo
    const glowEffect = document.createElement('div');
    glowEffect.className = 'absolute -top-20 -right-20 w-64 h-64 bg-fuchsia-600/20 blur-[80px] rounded-full';
    card.appendChild(glowEffect);
    
    // Contenido de la tarjeta
    const content = document.createElement('div');
    content.className = 'relative z-10';
    
    // Badge de prioridad (usar la prioridad real de la tarea)
    const priorityBadge = document.createElement('span');
    const priorityConfig = {
      alta: { icon: '🔴', text: 'Prioridad Alta', class: 'bg-red-500/20 text-red-400 border-red-500/30' },
      media: { icon: '🟡', text: 'Prioridad Media', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      baja: { icon: '🟢', text: 'Prioridad Baja', class: 'bg-green-500/20 text-green-400 border-green-500/30' }
    };
    const config = priorityConfig[task.priority] || priorityConfig.media;
    priorityBadge.className = `inline-block px-4 py-2 ${config.class} rounded-full text-sm font-bold uppercase tracking-wider mb-6`;
    priorityBadge.textContent = `${config.icon} ${config.text}`;
    content.appendChild(priorityBadge);
    
    // Título de la tarea
    const title = document.createElement('h2');
    title.className = 'text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight';
    title.textContent = task.title || 'Tarea sin título';
    content.appendChild(title);
    
    // Badge de tipo
    const typeBadge = document.createElement('span');
    typeBadge.className = 'inline-block px-4 py-2 bg-white/10 text-slate-300 border border-white/20 rounded-full text-sm font-bold uppercase tracking-wider mb-8';
    typeBadge.textContent = task.type === 'trabajo' ? '💼 Trabajo' : '👤 Personal';
    content.appendChild(typeBadge);
    
    // Temporizador integrado
    const timerSection = document.createElement('div');
    timerSection.className = 'mt-10 mb-10';
    
    const timerLabel = document.createElement('p');
    timerLabel.className = 'text-slate-400 text-sm uppercase tracking-widest mb-3';
    timerLabel.textContent = 'Temporizador Pomodoro';
    timerSection.appendChild(timerLabel);
    
    // Display del temporizador con clase .timer-display para sincronización global
    const timerValue = document.createElement('div');
    timerValue.className = 'timer-display text-6xl md:text-7xl font-black text-[#00d2ff] drop-shadow-[0_0_20px_rgba(0,210,255,0.5)] tracking-tighter';
    timerValue.textContent = formatTime(window.timeLeft || 1500);
    timerSection.appendChild(timerValue);
    
    // Controles del temporizador (botones con estilo neón)
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'flex justify-center gap-4 mt-6';
    
    // Botón Start/Pause
    const startPauseBtn = document.createElement('button');
    startPauseBtn.className = 'btn-start px-6 py-3 bg-[#00d2ff]/20 border border-white/10 text-[#00d2ff] font-bold rounded-xl hover:bg-white/10 transition-all';
    startPauseBtn.textContent = window.isRunning ? 'Pausar' : 'Iniciar';
    startPauseBtn.addEventListener('click', () => {
      if (window.isRunning) {
        window.pauseTimer();
      } else {
        window.startTimer();
      }
      // Actualizar texto del botón
      startPauseBtn.textContent = window.isRunning ? 'Pausar' : 'Iniciar';
    });
    controlsDiv.appendChild(startPauseBtn);
    
    // Botón Reset
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn-reset px-6 py-3 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-xl hover:bg-white/10 transition-all';
    resetBtn.textContent = 'Reiniciar';
    resetBtn.addEventListener('click', () => {
      window.resetTimer();
      // Actualizar texto del botón start/pause
      startPauseBtn.textContent = 'Iniciar';
    });
    controlsDiv.appendChild(resetBtn);
    
    timerSection.appendChild(controlsDiv);
    
    content.appendChild(timerSection);
    
    // Botones de acción (en fila)
    const actionsRow = document.createElement('div');
    actionsRow.className = 'flex gap-4 mt-8';
    
    // Botón de completar y salir
    const completeBtn = document.createElement('button');
    completeBtn.className = 'flex-1 py-5 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-fuchsia-500/30 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3';
    completeBtn.innerHTML = '<span>✓</span> Completar y Salir';
    completeBtn.addEventListener('click', () => this.completeAndExit());
    actionsRow.appendChild(completeBtn);
    
    // Botón de solo salir (manteniendo temporizador)
    const exitBtn = document.createElement('button');
    exitBtn.className = 'flex-1 py-5 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-3';
    exitBtn.innerHTML = '<span>✕</span> Salir del Focus';
    exitBtn.addEventListener('click', () => this.deactivate());
    actionsRow.appendChild(exitBtn);
    
    content.appendChild(actionsRow);
    
    card.appendChild(content);
    this.focusContent.appendChild(card);
  }

  /**
   * Complete the current task and exit focus mode
   */
  completeAndExit() {
    if (this.currentFocusTask && this.taskController) {
      // Marcar tarea como completada
      this.taskController.toggleTask(this.currentFocusTask.id);
      
      // Limpiar selección
      window.clearSelectedTask();
      
      // Actualizar localStorage (ya lo hace taskController)
      console.log(`Tarea completada: ${this.currentFocusTask.title}`);
    }
    
    // Salir del modo enfoque
    this.deactivate();
  }

  /**
   * Initialize the component
   */
  init() {
    this.initDOMReferences();
    this.createFocusOverlay();
    this.bindEvents();
  }

  /**
   * Bind event handlers
   */
  bindEvents() {
    if (this.btn) {
      this.btn.addEventListener('click', () => this.toggle());
    }
    
    // Salir con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isActive) {
        this.deactivate();
      }
    });
  }

  /**
   * Toggle focus mode on/off
   */
  toggle() {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
    
    // Actualizar estado del botón
    this.updateButtonState();
  }

  /**
   * Activate focus mode
   */
  activate() {
    // Verificar si hay una tarea seleccionada
    if (window.selectedTaskId === null) {
      // Mostrar alerta psicodélica pidiendo seleccionar una tarea
      window.showSelectTaskAlert();
      this.isActive = false;
      this.updateButtonState();
      return;
    }
    
    // Buscar la tarea seleccionada
    const tasks = this.taskCollection.getAll();
    const selectedTask = tasks.find(task => task.id === window.selectedTaskId);
    
    if (!selectedTask || selectedTask.completed) {
      // Si no existe o está completada, limpiar selección y mostrar alerta
      window.clearSelectedTask();
      window.showSelectTaskAlert();
      this.isActive = false;
      this.updateButtonState();
      return;
    }
    
    // Renderizar la tarea seleccionada en el overlay
    this.renderFocusTask(selectedTask);
    
    // Mostrar overlay con transición suave
    if (this.focusOverlay) {
      this.focusOverlay.classList.remove('opacity-0', 'pointer-events-none');
      this.focusOverlay.classList.add('opacity-100');
    }
    
    // Ocultar scroll del body
    document.body.style.overflow = 'hidden';
  }

  /**
   * Deactivate focus mode
   */
  deactivate() {
    // Ocultar overlay con transición suave
    if (this.focusOverlay) {
      this.focusOverlay.classList.remove('opacity-100');
      this.focusOverlay.classList.add('opacity-0', 'pointer-events-none');
    }
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    // Resetear estado activo
    this.isActive = false;
    this.updateButtonState();
    
    this.currentFocusTask = null;
  }

  /**
   * Update button visual state
   */
  updateButtonState() {
    if (!this.btn) return;
    
    if (this.isActive) {
      this.btn.classList.add('bg-fuchsia-600', 'dark:bg-fuchsia-500');
      this.btn.classList.remove('bg-white', 'dark:bg-slate-800');
      this.btn.title = 'Desactivar Modo Enfoque';
    } else {
      this.btn.classList.remove('bg-fuchsia-600', 'dark:bg-fuchsia-500');
      this.btn.classList.add('bg-white', 'dark:bg-slate-800');
      this.btn.title = 'Activar Modo Enfoque';
    }
  }
}

/**
 * Formatear tiempo en MM:SS (función helper para FocusMode)
 * @param {number} seconds - Tiempo en segundos
 * @returns {string} Tiempo formateado
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
