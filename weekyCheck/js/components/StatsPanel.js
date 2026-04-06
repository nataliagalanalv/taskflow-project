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
   * Actualiza la visualización de estadísticas y el gráfico radial.
   * 
   * Esta función recibe un objeto con las estadísticas calculadas (total, completadas, pendientes y porcentaje)
   * y actualiza todos los elementos del DOM correspondientes. Además, recalcula y renderiza el gráfico radial
   * basado en el porcentaje de tareas completadas.
   * 
   * El gráfico radial se actualiza mediante un gradiente cónico que representa visualmente el progreso:
   * - La porción completada usa el color primario (CHART_COLOR)
   * - La porción pendiente usa un color de track que varía según el tema (claro/oscuro)
   * 
   * @function updateStats
   * @param {Object} stats - Objeto de estadísticas con las propiedades:
   *   @param {number} stats.total - Número total de tareas
   *   @param {number} stats.completed - Número de tareas completadas
   *   @param {number} stats.pending - Número de tareas pendientes
   *   @param {number} stats.percentage - Porcentaje de completitud (0-100)
   * @returns {void}
   * 
   * @example
   * // Actualizar con estadísticas
   * statsPanel.update({
   *   total: 10,
   *   completed: 7,
   *   pending: 3,
   *   percentage: 70
   * });
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
   * Actualiza la visualización del gráfico radial de progreso.
   * 
   * Renderiza un gráfico circular usando CSS conic-gradient que muestra visualmente
   * el porcentaje de tareas completadas. El gráfico adapta sus colores según el tema
   * activo (claro u oscuro) para mantener la coherencia visual.
   * 
   * El gradiente cónico se construye con:
   * - Porción completada: Color primario (CHART_COLOR) que ocupa el porcentaje especificado
   * - Porción pendiente: Color de track que varía según si el tema es oscuro o claro
   * 
   * @function updateRadialChart
   * @param {number} percentage - Porcentaje de tareas completadas (valor entre 0 y 100)
   * @returns {void}
   * 
   * @example
   * // Gráfico al 75% de completitud
   * updateRadialChart(75);
   * // Resultado: conic-gradient(#00d2ff 75%, #e2e8f0 0%)
   */
  updateRadialChart(percentage) {
    if (!this.radialChart) return;

    const isDark = document.documentElement.classList.contains('dark');
    const trackColor = isDark ? TRACK_COLOR.dark : TRACK_COLOR.light;
    this.radialChart.style.background = `conic-gradient(${CHART_COLOR} ${percentage}%, ${trackColor} 0%)`;
  }
}