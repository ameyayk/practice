const consola = require('consola');

module.exports.findNumberOfFullyFormedSlides = (parentString, windowSize) => {
  const window = [];
  let clicker = 0;
  for (let i = 0; i < parentString.length; i += 1) {
    if (window.length === windowSize) {
      window.shift();
      clicker += 1;
      window.push(parentString.charAt(i));
      consola.info(window);
    } else if (window.length < windowSize) {
      // construct the window
      window.push(parentString.charAt(i));
      consola.info(window);
    }
  }
  // drain the window
  while (window.length > 0) {
    window.shift();
    consola.info(window);
  }
  return clicker;
};
