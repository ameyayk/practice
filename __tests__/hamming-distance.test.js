const { expect } = require('chai');
const { calculateHammingDistance } = require('../lib/hamming-distance');

describe('hamming distance', () => {
  it('should return an error if hamming distance is requsted for string of unequal length', () => {
    expect(() => calculateHammingDistance('stringOne', 'stringThree')).to.throw();
  });
  it('should return the correct hamming distance of same string', () => {
    const actual = calculateHammingDistance('a', 'a');
    expect(actual).to.be.eql(0);
  });
  it('should return the correct hammgin distance of 2 different strings', () => {
    const actual = calculateHammingDistance('a', 'b');
    expect(actual).to.be.eql(1);
  });
});
