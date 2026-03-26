const ALLOWED_PRIORITIES = new Set(['baja', 'media', 'alta']);
const ALLOWED_TYPES = new Set(['personal', 'trabajo']);

export function normalizeTitle(value) {
  return String(value ?? '').trim();
}

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

