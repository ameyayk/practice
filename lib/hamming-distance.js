module.exports.calculateHammingDistance = (string1, string2) => {
  if (string1.length !== string2.length) {
    throw new Error('String are of inequal length');
  }

  let hammingDistance = 0;
  for (let i = 0; i < string2.length; i += 1) {
    if (string1[i] !== string2[i]) {
      hammingDistance += 1;
    }
  }
  return hammingDistance;
};
