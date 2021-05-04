const { expect } = require('chai');
const { traverseAndSwitch } = require('../lib/switch-over');

describe('parent test case', () => {
  it('traverseAndSwitch should return the correctly traveresed string', () => {
    const actual = traverseAndSwitch('ADCBAX', 'DDABYK');
    expect(actual).to.be.eql('ADABAX');
  });
  it('traverseAndSwitch should return an error when two string of inequal length are passed', () => {
    expect(() => traverseAndSwitch('stringOne', 'stringThree')).to.throw();
  });
});
