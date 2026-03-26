const ALLOWED_PRIORITIES = new Set(['baja', 'media', 'alta']);
const ALLOWED_TYPES = new Set(['personal', 'trabajo']);

/**
 * Normalizes a title string by trimming whitespace
 * @param {string|any} value - The value to normalize
 * @returns {string} Trimmed string or empty string if falsy
 */
export function normalizeTitle(value) {
  return String(value ?? '').trim();
}

/**
 * Validates and normalizes new task data
 * @param {Object} params - Task validation parameters
 * @param {string} params.title - Task title
 * @param {string} params.priority - Task priority (baja, media, alta)
 * @param {string} params.type - Task type (personal, trabajo)
 * @returns {Object} Validation result with ok status and normalized value or error
 */
export function validateNewTask({ title, priority, type }) {
  const normalizedTitle = normalizeTitle(title);
  if (!normalizedTitle) {
    return { ok: false, error: 'EMPTY_TITLE' };
  }

  const normalizedPriority = String(priority ?? '').trim();
  const normalizedType = String(type ?? '').trim();

  return {
    ok: true,
    value: {
      title: normalizedTitle,
      priority: ALLOWED_PRIORITIES.has(normalizedPriority) ? normalizedPriority : 'media',
      type: ALLOWED_TYPES.has(normalizedType) ? normalizedType : 'personal',
    },
  };
}

