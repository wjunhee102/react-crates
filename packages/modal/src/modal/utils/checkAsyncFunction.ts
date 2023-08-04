// eslint-disable-next-line
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export function checkAsyncFunction(targetFunction: any) {
  if (!targetFunction || typeof targetFunction !== "function") {
    return false;
  }

  return targetFunction instanceof AsyncFunction;
}
