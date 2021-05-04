module.exports.doSomething = (a) => {
  const secondPower = a * a;
  const fourthPower = secondPower ** 2;
  return fourthPower;
};

module.exports.doSomethingAsynchronous = async (a) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return a ** 4;
};
