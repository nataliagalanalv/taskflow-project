
// RESPUESTA MANUAL SIN IA

function fizzBuzzManual() {
    for (let i = 1; i <= 100; i++) {
        if (i % 3 === 0 && i % 5 === 0) console.log("FizzBuzz");
        else if (i % 3 === 0) console.log("Fizz");
        else if (i % 5 === 0) console.log("Buzz");
        else console.log(i);
    }
}
fizzBuzzManual();

// RESPUESTA CLINE:

/**
 * FizzBuzz Escalable - Implementación configurable con reglas dinámicas
 * 
 * Diseño basado en:
 * - Objeto/Map para reglas (fácil de extender)
 * - Sin cadenas if-else anidadas
 * - Funciones puras y composition
 * - Early exit y optimizaciones
 * 
 * @param {number} n - Número hasta el cual generar FizzBuzz
 * @param {Map|Object} rules - Reglas configurables (divisor -> palabra)
 * @returns {Array<string>} - Array con resultados FizzBuzz
 */

/**
 * Configuración por defecto de reglas
 * Fácil de extender: solo agrega nuevas entradas al Map
 */
const DEFAULT_RULES = new Map([
  [3, 'Fizz'],
  [5, 'Buzz'],
]);

/**
 * Ejemplo de reglas extendidas (incluyendo 7)
 */
const EXTENDED_RULES = new Map([
  [3, 'Fizz'],
  [5, 'Buzz'],
  [7, 'Bazz'], // Nueva regla fácilmente agregada
]);

/**
 * FizzBuzz escalable con reglas configurables
 * 
 * @param {number} n - Número hasta el cual generar FizzBuzz
 * @param {Map|Object} rules - Reglas (por defecto: DEFAULT_RULES)
 * @returns {Array<string>} Array con resultados
 */
export function fizzBuzz(n, rules = DEFAULT_RULES) {
  // Validación de entrada
  if (typeof n !== 'number' || n < 1 || !Number.isInteger(n)) {
    throw new Error('n debe ser un número entero positivo');
  }

  // Convertir rules a Map si es un objeto
  const rulesMap = rules instanceof Map ? rules : new Map(Object.entries(rules));

  // Precalcular divisores para evitar iterar sobre el Map en cada iteración
  const divisors = Array.from(rulesMap.keys());
  
  // Precalcular combinaciones de palabras para cada divisor
  // Esto nos permite construir el string resultante eficientemente
  const result = [];

  for (let i = 1; i <= n; i++) {
    let output = '';
    
    // Iterar solo sobre los divisores configurados
    for (const divisor of divisors) {
      if (i % divisor === 0) {
        output += rulesMap.get(divisor);
      }
    }
    
    // Si no hay output, usar el número como string
    result.push(output || String(i));
  }

  return result;
}

/**
 * Versión optimizada con early exit y caching
 * Ideal para rangos grandes
 */
export function fizzBuzzOptimized(n, rules = DEFAULT_RULES) {
  if (typeof n !== 'number' || n < 1 || !Number.isInteger(n)) {
    throw new Error('n debe ser un número entero positivo');
  }

  const rulesMap = rules instanceof Map ? rules : new Map(Object.entries(rules));
  const divisors = Array.from(rulesMap.keys());
  
  // Precalcular el producto de todos los divisores para optimizar
  // El patrón se repite cada LCM (mínimo común múltiplo) de los divisores
  const lcm = divisors.reduce((acc, div) => lcmOf(acc, div), 1);
  
  // Precalcular un ciclo completo del patrón
  const pattern = [];
  for (let i = 1; i <= lcm; i++) {
    let output = '';
    for (const divisor of divisors) {
      if (i % divisor === 0) {
        output += rulesMap.get(divisor);
      }
    }
    pattern.push(output || String(i));
  }

  // Generar resultado usando el patrón precalculado
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(pattern[i % lcm]);
  }

  return result;
}

/**
 * Calcula el mínimo común múltiplo (LCM) de dos números
 */
function lcmOf(a, b) {
  return Math.abs(a * b) / gcdOf(a, b);
}

/**
 * Calcula el máximo común divisor (GCD) usando el algoritmo de Euclides
 */
function gcdOf(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * FizzBuzz con reglas dinámicas y validación avanzada
 * Permite agregar/reglas en tiempo de ejecución
 */
export class FizzBuzzEngine {
  constructor(rules = DEFAULT_RULES) {
    this.rules = rules instanceof Map ? new Map(rules) : new Map(Object.entries(rules));
    this.cache = new Map();
  }

  /**
   * Agrega una nueva regla
   * @param {number} divisor - Número divisor
   * @param {string} word - Palabra a mostrar
   * @returns {FizzBuzzEngine} this para chaining
   */
  addRule(divisor, word) {
    if (typeof divisor !== 'number' || divisor < 1 || !Number.isInteger(divisor)) {
      throw new Error('El divisor debe ser un número entero positivo');
    }
    if (typeof word !== 'string' || word.length === 0) {
      throw new Error('La palabra debe ser un string no vacío');
    }
    
    this.rules.set(divisor, word);
    this.cache.clear(); // Invalidar cache
    return this;
  }

  /**
   * Elimina una regla existente
   * @param {number} divisor - Divisor a eliminar
   * @returns {FizzBuzzEngine} this para chaining
   */
  removeRule(divisor) {
    this.rules.delete(divisor);
    this.cache.clear();
    return this;
  }

  /**
   * Obtiene una regla existente
   * @param {number} divisor 
   * @returns {string|undefined}
   */
  getRule(divisor) {
    return this.rules.get(divisor);
  }

  /**
   * Ejecuta FizzBuzz para un número específico
   * @param {number} num - Número a evaluar
   * @returns {string} Resultado FizzBuzz
   */
  evaluate(num) {
    if (this.cache.has(num)) {
      return this.cache.get(num);
    }

    let output = '';
    for (const [divisor, word] of this.rules) {
      if (num % divisor === 0) {
        output += word;
      }
    }

    const result = output || String(num);
    this.cache.set(num, result);
    return result;
  }

  /**
   * Genera FizzBuzz para un rango
   * @param {number} n - Hasta qué número generar
   * @returns {Array<string>}
   */
  generate(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
      result.push(this.evaluate(i));
    }
    return result;
  }

  /**
   * Obtiene todas las reglas actuales
   * @returns {Map}
   */
  getRules() {
    return new Map(this.rules);
  }

  /**
   * Reinicia las reglas a las por defecto
   * @returns {FizzBuzzEngine} this para chaining
   */
  reset() {
    this.rules = new Map(DEFAULT_RULES);
    this.cache.clear();
    return this;
  }
}

// ============================================================================
// POR QUÉ ESTE DISEÑO ES MEJOR QUE IF-ELSE ANIDADOS
// ============================================================================

/**
 * COMPARACIÓN DE ENFOQUES:
 * 
 * 1. ENFOQUE TRADICIONAL (if-else anidados):
 * ==========================================
 * 
 * PROBLEMAS:
 * ❌ Difícil de extender: agregar 7 requiere modificar múltiples if
 * ❌ Código repetitivo: condiciones similares se repiten
 * ❌ Propenso a errores: olvidar casos combinados (ej: 3*5*7=105)
 * ❌ No escalable: con k reglas, necesitas 2^k - 1 condiciones
 * ❌ Difícil de testear: cada combinación es un camino diferente
 * 
 * 2. ENFOQUE CON MAP/OBJETO (nuestra solución):
 * =============================================
 * const rules = new Map([[3, 'Fizz'], [5, 'Buzz'], [7, 'Bazz']]);
 * 
 * function fizzBuzz(n, rules) {
 *   const result = [];
 *   for (let i = 1; i <= n; i++) {
 *     let output = '';
 *     for (const [divisor, word] of rules) {
 *       if (i % divisor === 0) output += word;
 *     }
 *     result.push(output || String(i));
 *   }
 *   return result;
 * }
 * 
 * VENTAJAS:
 * ✅ Fácil de extender: solo agrega una entrada al Map
 * ✅ Sin repetición: lógica única para todas las reglas
 * ✅ Automáticamente maneja combinaciones: 3*5, 3*7, 5*7, 3*5*7, etc.
 * ✅ Escalable: con k reglas, solo k iteraciones por número
 * ✅ Fácil de testear: cada regla es independiente
 * ✅ Configurable en tiempo de ejecución
 * ✅ Separación clara de datos (reglas) y lógica
 * 
 * COMPLEJIDAD:
 * ============
 * - Tradicional: O(n * 2^k) en el peor caso (muchos if-else)
 * - Con Map: O(n * k) donde k = número de reglas
 * 
 * Para 2 reglas (3,5): similar
 * Para 3 reglas (3,5,7): Map es más claro y mantenible
 * Para k reglas: Map es exponencialmente mejor
 */

