/** Deep cloning of an Object */
export function clone<T = any>(obj: T): T {
  /* c8 ignore next 6 */
  // a polyfill for structuredClone
  if (typeof structuredClone === "undefined") {
    return JSON.parse(JSON.stringify(obj));
  } else {
    return structuredClone(obj);
  }
}
