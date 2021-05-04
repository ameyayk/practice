const { expect } = require('chai');
const { createPatternTable } = require('../lib/kmp');

describe('hamming distance', () => {
  xit('should return the correct hammgin distance of 2 different strings', () => {
    const actual = createPatternTable('aabaabaa');
    expect(actual).to.be.eql(1);
  });
});
