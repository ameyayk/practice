const { expect } = require('chai');
const { findNumberOfFullyFormedSlides } = require('../lib/sliding-window');

describe('Minimum window test suite', () => {
  it('', () => {
    const parentString = '0123456789';
    const windowSize = 4;
    const actual = findNumberOfFullyFormedSlides(parentString, windowSize);
    expect(actual).to.be.eql(6);
  });
});
