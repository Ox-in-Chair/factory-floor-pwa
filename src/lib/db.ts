/**
 * Minimal form save/load stubs using localStorage to avoid breaking existing wizards.
 * Key is passed in by caller.
 */
export async function saveForm(key: string, data: unknown): Promise<void> {
  try {
    localStorage.setItem(`form:${key}`, JSON.stringify(data));
  } catch {}
}
export async function loadForm<T>(key: string): Promise<T | null> {
  try {
    const v = localStorage.getItem(`form:${key}`);
    if (v) return JSON.parse(v) as T;
  } catch {}
  return null;
}
