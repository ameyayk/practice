module.exports.traverseAndSwitch = (string1, string2) => {
  if (string1.length !== string2.length) {
    throw new Error('string are of inequal length');
  }
  const arrayOfUpperCasedString1 = string1.toUpperCase().split('');
  const arrayOfUpperCasedString2 = string2.toUpperCase().split('');
  const commonlyTraversedString = [];
  let arrayToTraverse = arrayOfUpperCasedString1;
  let arrayToSwitchOver = arrayOfUpperCasedString2;
  for (let i = 0; i < arrayOfUpperCasedString1.length; i += 1) {
    commonlyTraversedString.push(arrayToTraverse[i]);
    if (arrayToTraverse[i] === arrayToSwitchOver[i]) {
      const tempArray = arrayToTraverse;
      arrayToTraverse = arrayToSwitchOver;
      arrayToSwitchOver = tempArray;
    }
  }
  return commonlyTraversedString.join('');
};
