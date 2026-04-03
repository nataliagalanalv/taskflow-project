/**
 * StatsPanel - Componente para mostrar estadísticas de tareas
 */

import { CHART_COLOR, TRACK_COLOR } from '../utils/constants.js';

export class StatsPanel {
  constructor() {
    this.totalSpan = null;
    this.pendingSpan = null;
    this.completedSpan = null;
    this.percentageLabel = null;
    this.radialChart = null;
  }

  /**
   * Initialize DOM references
   */
  initDOMReferences() {
    this.totalSpan = document.getElementById('total');
    this.pendingSpan = document.getElementById('pending');
    this.completedSpan = document.getElementById('completed');
    this.percentageLabel = document.getElementById('percentage-label');
    this.radialChart = document.getElementById('radial-chart');
  }

  /**
   * Initialize the component
   */
  init() {
    this.initDOMReferences();
  }

  /**
   * Update statistics display
   * @param {Object} stats - Statistics object with total, completed, pending, percentage
   */
  update(stats) {
    const { total, completed, pending, percentage } = stats;

    if (this.totalSpan) this.totalSpan.textContent = total;
    if (this.pendingSpan) this.pendingSpan.textContent = pending;
    if (this.completedSpan) this.completedSpan.textContent = completed;
    if (this.percentageLabel) this.percentageLabel.textContent = percentage;

    this.updateRadialChart(percentage);
  }

  /**
   * Update the radial chart visualization
   * @param {number} percentage - Percentage of completed tasks
   */
  updateRadialChart(percentage) {
    if (!this.radialChart) return;

    const isDark = document.documentElement.classList.contains('dark');
    const trackColor = isDark ? TRACK_COLOR.dark : TRACK_COLOR.light;
    this.radialChart.style.background = `conic-gradient(${CHART_COLOR} ${percentage}%, ${trackColor} 0%)`;
  }
}