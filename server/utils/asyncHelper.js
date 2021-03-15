export const delayed = (fn, timeout = 3000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => fn(resolve, reject), timeout);
  });
};
