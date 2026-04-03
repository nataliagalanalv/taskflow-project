// RESPUESTA MANUAL SIN IA

function characterCounter(frase) {
    let result = {};
    for (let letter of frase) {
        if (letter !== " ") {
            result[letter] = (result[letter] || 0) + 1;
        }
    }
    return result;
}
console.log(characterCounter("hola mundo"));


// RESPUESTA CLINE:

/**
 * Conteo de Frecuencia de Caracteres - Enfoque Funcional
 * 
 * Implementación moderna usando:
 * - Programación funcional (reduce, map, filter)
 * - Inmutabilidad
 * - Composición de funciones
 * - Tipos genéricos
 * 
 * @param {string} str - String a analizar
 * @param {Object} options - Configuración opcional
 * @returns {Map|string} Mapa de frecuencias o string formateado
 */

/**
 * Opciones de configuración
 */
const DEFAULT_OPTIONS = {
  caseSensitive: false,      // Ignorar mayúsculas/minúsculas
  ignoreSpaces: true,        // Ignorar espacios
  ignorePunctuation: true,   // Ignorar puntuación
  ignoreNumbers: false,      // Ignorar números
  ignoreAccents: true,       // Normalizar acentos
  minFrequency: 1,           // Frecuencia mínima para incluir
  sortBy: 'frequency',       // 'frequency', 'char', 'none'
  sortOrder: 'desc',         // 'asc' o 'desc'
  format: 'map',             // 'map', 'object', 'array', 'string'
};

/**
 * Función principal de conteo de frecuencia
 * Enfoque funcional con composición y inmutabilidad
 * 
 * @param {string} str - String de entrada
 * @param {Object} options - Opciones de configuración
 * @returns {Map|Object|Array|string} Resultado según formato solicitado
 */
export function charFrequency(str, options = {}) {
  // Merge con opciones por defecto (inmutable)
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // Pipeline funcional de transformaciones
  return pipe(
    // 1. Normalizar string
    normalizeString(config),
    
    // 2. Convertir a array de caracteres
    splitToChars,
    
    // 3. Filtrar caracteres no deseados
    filterChars(config),
    
    // 4. Contar frecuencias
    countFrequencies,
    
    // 5. Filtrar por frecuencia mínima
    filterByFrequency(config),
    
    // 6. Ordenar resultados
    sortResults(config),
    
    // 7. Formatear salida
    formatOutput(config)
  )(str);
}

/**
 * Implementa composition de funciones (pipe)
 * Aplica funciones de izquierda a derecha
 */
function pipe(...fns) {
  return (input) => fns.reduce((acc, fn) => fn(acc), input);
}

/**
 * 1. Normaliza el string según configuración
 * Devuelve una función que procesa el string
 */
function normalizeString(config) {
  return (str) => {
    if (!str || typeof str !== 'string') return '';
    
    let normalized = str;
    
    // Normalizar acentos (ñ → n, á → a, etc.)
    if (config.ignoreAccents) {
      normalized = normalized
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/gi, 'n');
    }
    
    // Convertir a minúsculas si no es case-sensitive
    if (!config.caseSensitive) {
      normalized = normalized.toLowerCase();
    }
    
    return normalized;
  };
}

/**
 * 2. Convierte string a array de caracteres
 * Usa Array.from para manejar correctamente Unicode
 */
function splitToChars(str) {
  return Array.from(str);
}

/**
 * 3. Filtra caracteres según configuración
 * Devuelve una función que filtra el array
 */
function filterChars(config) {
  return (chars) => {
    return chars.filter(char => {
      // Ignorar espacios
      if (config.ignoreSpaces && /\s/.test(char)) return false;
      
      // Ignorar puntuación
      if (config.ignorePunctuation && /[^\w\s]/.test(char)) return false;
      
      // Ignorar números
      if (config.ignoreNumbers && /\d/.test(char)) return false;
      
      // Solo caracteres alfanuméricos (letras y números)
      return /\w/.test(char);
    });
  };
}

/**
 * 4. Cuenta frecuencias usando reduce
 * Devuelve un Map (más eficiente que objeto para conteos)
 */
function countFrequencies(chars) {
  return chars.reduce((freqMap, char) => {
    const count = freqMap.get(char) || 0;
    return new Map(freqMap).set(char, count + 1);
  }, new Map());
}

/**
 * 5. Filtra por frecuencia mínima
 * Devuelve una función que filtra el Map
 */
function filterByFrequency(config) {
  return (freqMap) => {
    if (config.minFrequency <= 1) return freqMap;
    
    return new Map(
      Array.from(freqMap.entries())
        .filter(([_, count]) => count >= config.minFrequency)
    );
  };
}

/**
 * 6. Ordena resultados según configuración
 * Devuelve una función que ordena el Map
 */
function sortResults(config) {
  return (freqMap) => {
    if (config.sortBy === 'none') return freqMap;
    
    const entries = Array.from(freqMap.entries());
    
    const sorted = entries.sort(([charA, countA], [charB, countB]) => {
      let comparison = 0;
      
      if (config.sortBy === 'frequency') {
        comparison = countA - countB;
      } else if (config.sortBy === 'char') {
        comparison = charA.localeCompare(charB);
      }
      
      return config.sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return new Map(sorted);
  };
}

/**
 * 7. Formatea la salida según configuración
 * Devuelve una función que transforma el Map al formato deseado
 */
function formatOutput(config) {
  return (freqMap) => {
    switch (config.format) {
      case 'object':
        return Object.fromEntries(freqMap);
      
      case 'array':
        return Array.from(freqMap.entries())
          .map(([char, count]) => ({ char, count }));
      
      case 'string':
        return Array.from(freqMap.entries())
          .map(([char, count]) => `${char}: ${count}`)
          .join('\n');
      
      case 'map':
      default:
        return freqMap;
    }
  };
}

// ============================================================================
// POR QUÉ EL ENFOQUE FUNCIONAL ES PREFERIBLE EN ENTORNOS MODERNOS
// ============================================================================

/**
 * VENTAJAS DEL ENFOQUE FUNCIONAL:
 * 
 * 1. INMUTABILIDAD:
 *    - Los datos nunca se modifican, se crean nuevos
 *    - Previene efectos secundarios inesperados
 *    - Más fácil de depurar y testear
 *    - Thread-safe en entornos paralelos
 * 
 * 2. COMPOSICIÓN:
 *    - Funciones pequeñas y específicas
 *    - Fáciles de reutilizar y combinar
 *    - Pipeline claro de transformaciones
 *    - Cada función hace una cosa bien
 * 
 * 3. DECLARATIVO:
 *    - describes QUÉ quieres, no CÓMO hacerlo
 *    - Más legible y mantenible
 *    - Menos propenso a bugs
 * 
 * 4. TESTEABILIDAD:
 *    - Funciones puras (misma entrada → misma salida)
 *    - Fácil de mockear y testear unitariamente
 *    - Sin estado compartido
 * 
 * 5. CONCURRENCIA:
 *    - Sin efectos secundarios = seguro para paralelizar
 *    - Web Workers, Service Workers
 *    - React Concurrent Mode
 * 
 * 6. OPTIMIZACIÓN:
 *    - Memoization automática posible
 *    - Lazy evaluation
 *    - Tree-shaking más efectivo
 */

// ============================================================================
// BENCHMARK
// ============================================================================

console.log('\n=== Benchmark de Rendimiento ===\n');

const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
const iterations = 1000;

// Versión tradicional (imperativa)
function charFrequencyImperative(str) {
  const freq = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i].toLowerCase();
    if (/[a-z]/.test(char)) {
      freq[char] = (freq[char] || 0) + 1;
    }
  }
  return freq;
}

// Benchmark imperativo
const start1 = performance.now();
for (let i = 0; i < iterations; i++) {
  charFrequencyImperative(longText);
}
const time1 = performance.now() - start1;

// Benchmark funcional
const start2 = performance.now();
for (let i = 0; i < iterations; i++) {
  charFrequency(longText, { caseSensitive: false, ignoreAccents: true });
}
const time2 = performance.now() - start2;

console.log(`Imperativo:  ${time1.toFixed(2)}ms`);
console.log(`Funcional:   ${time2.toFixed(2)}ms`);
console.log(`Diferencia:  ${((time2 - time1) / time1 * 100).toFixed(1)}% ${time2 > time1 ? 'más lento' : 'más rápido'}`);

console.log('\nNota: El enfoque funcional puede ser ligeramente más lento debido a las múltiples transformaciones,');
console.log('pero gana en mantenibilidad, testeabilidad y escalabilidad.');

// Exportar para uso en otros módulos
export { DEFAULT_OPTIONS, simpleCharFrequency, mostFrequentChar, topNChars, compareFrequencies };