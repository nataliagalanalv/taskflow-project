const ALLOWED_PRIORITIES = new Set(['baja', 'media', 'alta']);
const ALLOWED_TYPES = new Set(['personal', 'trabajo']);
const MIN_TITLE_LENGTH = 3;

const VALIDATION_MESSAGES = {
  EMPTY_TITLE: 'El título es obligatorio.',
  TITLE_TOO_SHORT: `El título debe tener al menos ${MIN_TITLE_LENGTH} caracteres.`,
  INVALID_PRIORITY: 'Debes seleccionar una prioridad válida.',
  INVALID_TYPE: 'Debes seleccionar un tipo válido.',
};

/**
 * Normalizes a title-like value by coercing to string and trimming spaces.
 *
 * @param {unknown} value - Raw title input.
 * @returns {string} Normalized title.
 */
export function normalizeTitle(value) {
  return String(value ?? '').trim();
}

/**
 * Sanitizes free text to reduce XSS risk.
 * Removes HTML tags and escapes risky characters.
 *
 * @param {unknown} value - Raw text input.
 * @returns {string} Sanitized text.
 */
export function sanitizeText(value) {
  const raw = String(value ?? '');
  const withoutTags = raw.replace(/<[^>]*>/g, '');

  return withoutTags
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

/**
 * Validates and sanitizes new task input.
 *
 * @param {{title: unknown, priority: unknown, type: unknown}} params - Candidate task fields.
 * @returns {{
 *   ok: true,
 *   errors: string[],
 *   errorsByField: { title: string[], priority: string[], type: string[] },
 *   value: { title: string, priority: string, type: string }
 * } | {
 *   ok: false,
 *   errors: string[],
 *   errorsByField: { title: string[], priority: string[], type: string[] },
 *   sanitized: { title: string, priority: string, type: string }
 * }} Validation result.
 */
export function validateNewTask({ title, priority, type }) {
  const errors = [];
  const errorsByField = {
    title: [],
    priority: [],
    type: [],
  };

  const sanitizedTitle = sanitizeText(title);
  const normalizedTitle = normalizeTitle(sanitizedTitle);
  if (!normalizedTitle) {
    errorsByField.title.push('EMPTY_TITLE');
  } else if (normalizedTitle.length < MIN_TITLE_LENGTH) {
    errorsByField.title.push('TITLE_TOO_SHORT');
  }

  const normalizedPriority = String(priority ?? '').trim();
  const normalizedType = String(type ?? '').trim();
  if (!normalizedPriority || !ALLOWED_PRIORITIES.has(normalizedPriority)) {
    errorsByField.priority.push('INVALID_PRIORITY');
  }

  if (!normalizedType || !ALLOWED_TYPES.has(normalizedType)) {
    errorsByField.type.push('INVALID_TYPE');
  }

  Object.values(errorsByField).forEach((fieldErrors) => {
    errors.push(...fieldErrors);
  });

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
      errorsByField,
      sanitized: {
        title: normalizedTitle,
        priority: normalizedPriority,
        type: normalizedType,
      },
    };
  }

  return {
    ok: true,
    errors: [],
    errorsByField,
    value: {
      title: normalizedTitle,
      priority: normalizedPriority,
      type: normalizedType,
    },
  };
}

/**
 * Resolves the first known validation error code to a user-facing message.
 *
 * @param {string[]} [errorCodes=[]] - Validation error codes.
 * @returns {string} Human-readable message or empty string.
 */
export function getFirstErrorMessage(errorCodes = []) {
  const firstCode = errorCodes[0];
  if (!firstCode) return '';
  return VALIDATION_MESSAGES[firstCode] || 'Entrada inválida.';
}

