export const withMinimumDelay = async (promise, minDelay = 600) => {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, minDelay)),
  ]);

  return result;
};