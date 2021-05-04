const { expect } = require('chai');
const { findNoble } = require('../lib/noble');

describe('parent test case', () => {
  xit('findNoble should return correctly if a noble integeer is present', () => {
    const actual = findNoble([7, 3, 16, 10]);
    expect(actual).to.be.eql(3);
  });
  xit('findNoble should return 0 if no noble element is present', () => {
    const actual = findNoble([-1, -9, -2, -78, 0]);
    expect(actual).to.be.eql(0);
  });
  it('findNoble should return properly if a noble element is present even in case of duplicates', () => {
    const actual = findNoble([7, 3, 5, 3, 6]);
    expect(actual).to.be.eql(3);
  });
});
