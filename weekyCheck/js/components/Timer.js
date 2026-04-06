/**
 * Timer - Componente de temporizador de cuenta atrás (25 minutos)
 * Independiente de las operaciones de tareas
 */

export class Timer {
  constructor() {
    // Timer configuration
    this.DURATION = 25 * 60; // 25 minutes in seconds
    this.WARNING_THRESHOLD = 5 * 60; // 5 minutes in seconds
    
    // Timer state
    this.remainingTime = this.DURATION;
    this.isRunning = false;
    this.intervalId = null;
    
    // DOM elements
    this.displayElement = null;
    this.startPauseBtn = null;
    this.resetBtn = null;
  }

  /**
   * Initialize DOM references
   */
  initDOMReferences() {
    this.displayElement = document.getElementById('timer-display');
    this.startPauseBtn = document.getElementById('timer-start-pause');
    this.resetBtn = document.getElementById('timer-reset');
  }

  /**
   * Format time as MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Update the timer display with current time and color
   */
  updateDisplay() {
    if (!this.displayElement) return;
    
    // Update time display
    this.displayElement.textContent = this.formatTime(this.remainingTime);
    
    // Update color based on remaining time
    // Transition from text-[#00d2ff] (blue) to text-fuchsia-500 when < 5 minutes
    const isWarning = this.remainingTime < this.WARNING_THRESHOLD;
    
    if (isWarning) {
      this.displayElement.classList.remove('text-[#00d2ff]');
      this.displayElement.classList.add('text-fuchsia-500');
    } else {
      this.displayElement.classList.remove('text-fuchsia-500');
      this.displayElement.classList.add('text-[#00d2ff]');
    }
    
    // Update button text
    if (this.startPauseBtn) {
      this.startPauseBtn.textContent = this.isRunning ? 'Pausar' : 'Iniciar';
    }
  }

  /**
   * Start the timer
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.updateDisplay();
      } else {
        // Timer completed
        this.pause();
        // Timer finished - could add notification here
      }
    }, 1000);
    
    this.updateDisplay();
  }

  /**
   * Pause the timer
   */
  pause() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.updateDisplay();
  }

  /**
   * Toggle start/pause
   */
  toggleStartPause() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  /**
   * Reset the timer to initial state (25 minutes)
   */
  reset() {
    this.pause();
    this.remainingTime = this.DURATION;
    this.updateDisplay();
  }

  /**
   * Initialize the component
   */
  init() {
    this.initDOMReferences();
    
    // Bind event listeners
    if (this.startPauseBtn) {
      this.startPauseBtn.addEventListener('click', () => this.toggleStartPause());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    // Initial display
    this.updateDisplay();
  }
}