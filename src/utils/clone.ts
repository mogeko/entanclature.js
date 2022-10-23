export function clone<T = any>(obj: T): T {
  if (typeof structuredClone === "undefined") {
    return JSON.parse(JSON.stringify(obj));
  } else {
    return structuredClone(obj);
  }
}
