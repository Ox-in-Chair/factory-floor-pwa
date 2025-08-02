export const debounce = <T extends (...args: any[]) => any>(fn: T, wait = 500) => {
  let timer: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};
