export function delay(duration: number = 0) {
  return new Promise((resolve) => {
    if (setTimeout || duration < 0) {
      setTimeout(() => {
        resolve(true);
      }, duration);
    } else {
      resolve(true);
    }
  });
}
