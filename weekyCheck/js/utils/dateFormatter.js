/**
 * Formats a timestamp into a relative time string using the native Intl.RelativeTimeFormat API.
 * 
 * @param {number|string|Date} timestamp - The timestamp to format (milliseconds, ISO string, or Date object)
 * @param {string} [locale='es-ES'] - The locale for formatting (default: Spanish)
 * @returns {string} A relative time string (e.g., 'justo ahora', 'hace 2 horas', 'ayer')
 */
export function formatRelativeTime(timestamp, locale = 'es-ES') {
  const now = new Date();
  const past = new Date(timestamp);
  
  // Validate dates
  if (isNaN(now.getTime()) || isNaN(past.getTime())) {
    throw new Error('Invalid timestamp provided');
  }
  
  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - past.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30); // Approximate
  const diffYears = Math.floor(diffDays / 365);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { 
    numeric: 'auto',
    localeMatcher: 'best fit'
  });
  
  // Determine the most appropriate unit
  if (diffSeconds < 10) {
    return locale.startsWith('es') ? 'justo ahora' : 'just now';
  } else if (diffSeconds < 60) {
    return rtf.format(-diffSeconds, 'second');
  } else if (diffMinutes < 60) {
    return rtf.format(-diffMinutes, 'minute');
  } else if (diffHours < 24) {
    return rtf.format(-diffHours, 'hour');
  } else if (diffDays === 1) {
    return locale.startsWith('es') ? 'ayer' : 'yesterday';
  } else if (diffDays < 30) {
    return rtf.format(-diffDays, 'day');
  } else if (diffMonths === 1) {
    return locale.startsWith('es') ? 'el mes pasado' : 'last month';
  } else if (diffMonths < 12) {
    return rtf.format(-diffMonths, 'month');
  } else if (diffYears === 1) {
    return locale.startsWith('es') ? 'el año pasado' : 'last year';
  } else {
    return rtf.format(-diffYears, 'year');
  }
}

/**
 * Formats a timestamp for future dates (optional helper)
 * 
 * @param {number|string|Date} timestamp - The future timestamp to format
 * @param {string} [locale='es-ES'] - The locale for formatting
 * @returns {string} A relative time string for future dates
 */
export function formatFutureRelativeTime(timestamp, locale = 'es-ES') {
  const now = new Date();
  const future = new Date(timestamp);
  
  // Validate dates
  if (isNaN(now.getTime()) || isNaN(future.getTime())) {
    throw new Error('Invalid timestamp provided');
  }
  
  // Calculate the difference in milliseconds
  const diffMs = future.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30); // Approximate
  const diffYears = Math.floor(diffDays / 365);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { 
    numeric: 'auto',
    localeMatcher: 'best fit'
  });
  
  // Determine the most appropriate unit
  if (diffSeconds < 10) {
    return locale.startsWith('es') ? 'en un momento' : 'in a moment';
  } else if (diffSeconds < 60) {
    return rtf.format(diffSeconds, 'second');
  } else if (diffMinutes < 60) {
    return rtf.format(diffMinutes, 'minute');
  } else if (diffHours < 24) {
    return rtf.format(diffHours, 'hour');
  } else if (diffDays === 1) {
    return locale.startsWith('es') ? 'mañana' : 'tomorrow';
  } else if (diffDays < 30) {
    return rtf.format(diffDays, 'day');
  } else if (diffMonths === 1) {
    return locale.startsWith('es') ? 'el próximo mes' : 'next month';
  } else if (diffMonths < 12) {
    return rtf.format(diffMonths, 'month');
  } else if (diffYears === 1) {
    return locale.startsWith('es') ? 'el próximo año' : 'next year';
  } else {
    return rtf.format(diffYears, 'year');
  }
}

export default { formatRelativeTime, formatFutureRelativeTime };