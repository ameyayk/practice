module.exports.findNoble = (elements) => {
  const sortedArray = elements.sort((a, b) => a - b);

  if (sortedArray[sortedArray.length - 1] <= 0) {
    return 0;
  }
  const sortedArrayLength = sortedArray.length;
  for (let i = 0; i < sortedArray.length - 1; i += 1) {
    if (sortedArray[i] === sortedArray[i + 1]) {
      i += 1;
    }
    const numberOfelementsPostTheCurrentIndex = sortedArrayLength - 1 - i;
    if (numberOfelementsPostTheCurrentIndex === sortedArray[i]) {
      return sortedArray[i];
    }
  }
  return 0;
};
