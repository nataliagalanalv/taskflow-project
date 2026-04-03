/**
 * FilterBar - Componente para gestionar los filtros de tareas
 */

import { FILTER_ACTIVE_CLASSES, FILTER_INACTIVE_CLASSES, FILTER_TYPES } from '../utils/constants.js';

export class FilterBar {
  constructor() {
    this.filterButtons = null;
    this.prioritySelect = null;
    this.typeSelect = null;
    this.searchInput = null;
    this.currentFilter = FILTER_TYPES.ALL;
  }

  /**
   * Initialize DOM references
   */
  initDOMReferences() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.prioritySelect = document.getElementById('prioritySelect');
    this.typeSelect = document.getElementById('typeSelect');
    this.searchInput = document.getElementById('search-task');
  }

  /**
   * Initialize filter bar state
   */
  init() {
    this.initDOMReferences();
    this.syncButtonsUI();
  }

  /**
   * Set visual active state of a filter button
   * @param {HTMLElement} filterButton - The button element to update
   * @param {boolean} isActive - Whether the button should be in active state
   */
  setButtonActiveState(filterButton, isActive) {
    filterButton.classList.remove(...FILTER_ACTIVE_CLASSES, ...FILTER_INACTIVE_CLASSES);
    if (isActive) {
      filterButton.classList.add(...FILTER_ACTIVE_CLASSES);
    } else {
      filterButton.classList.add(...FILTER_INACTIVE_CLASSES);
    }
    filterButton.style.backgroundColor = "";
    filterButton.dataset.active = isActive ? 'true' : 'false';
    filterButton.setAttribute('aria-selected', isActive ? 'true' : 'false');
  }

  /**
   * Synchronize all filter buttons to reflect current filter state
   */
  syncButtonsUI() {
    this.filterButtons.forEach(filterButton => {
      this.setButtonActiveState(filterButton, filterButton.dataset.filter === this.currentFilter);
    });
  }

  /**
   * Set current filter and update UI
   * @param {string} filter - Filter type (all, pending, completed)
   */
  setFilter(filter) {
    this.currentFilter = filter;
    this.syncButtonsUI();
  }

  /**
   * Get current filter value
   * @returns {string}
   */
  getFilter() {
    return this.currentFilter;
  }

  /**
   * Get current search text
   * @returns {string}
   */
  getSearchText() {
    return (this.searchInput?.value || "").toLowerCase();
  }

  /**
   * Get current priority filter value
   * @returns {string}
   */
  getPriorityFilter() {
    return this.prioritySelect?.value || 'all';
  }

  /**
   * Get current type filter value
   * @returns {string}
   */
  getTypeFilter() {
    return this.typeSelect?.value || 'all';
  }

  /**
   * Create a filter function based on current filter state
   * @returns {Function} Filter function
   */
  createFilterFn() {
    return (tasks) => {
      const searchText = this.getSearchText();
      const valPriority = this.getPriorityFilter();
      const valType = this.getTypeFilter();

      return tasks.filter(task => {
        const matchesFilter =
          this.currentFilter === FILTER_TYPES.ALL ||
          (this.currentFilter === FILTER_TYPES.COMPLETED && task.completed) ||
          (this.currentFilter === FILTER_TYPES.PENDING && !task.completed);

        const matchesSearch =
          searchText === "" ||
          (task.title || "").toLowerCase().includes(searchText);
        const matchesPriority = valPriority === 'all' || task.priority === valPriority;
        const matchesType = valType === 'all' || task.type === valType;

        return matchesFilter && matchesSearch && matchesPriority && matchesType;
      });
    };
  }

  /**
   * Bind filter button click events
   * @param {Function} callback - Callback when filter changes
   */
  bindFilterButtons(callback) {
    this.filterButtons.forEach(filterButton => {
      filterButton.addEventListener('click', () => {
        this.setFilter(filterButton.dataset.filter);
        callback && callback();
      });
    });
  }

  /**
   * Bind search input event
   * @param {Function} callback - Callback when search changes
   */
  bindSearchInput(callback) {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        callback && callback();
      });
    }
  }

  /**
   * Bind filter dropdown change events
   * @param {Function} callback - Callback when filters change
   */
  bindFilterDropdowns(callback) {
    if (this.prioritySelect) {
      this.prioritySelect.addEventListener('change', () => {
        callback && callback();
      });
    }
    if (this.typeSelect) {
      this.typeSelect.addEventListener('change', () => {
        callback && callback();
      });
    }
  }

  /**
   * Bind all events
   * @param {Function} onFilterChange - Callback for filter changes
   * @param {Function} onSearchChange - Callback for search changes
   */
  bindEvents(onFilterChange, onSearchChange) {
    this.bindFilterButtons(onFilterChange);
    this.bindSearchInput(onSearchChange);
    this.bindFilterDropdowns(onFilterChange);
  }
}