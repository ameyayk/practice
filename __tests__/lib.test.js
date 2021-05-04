const { expect } = require('chai');
const { doSomething, doSomethingAsynchronous } = require('../lib/index');

describe('parent test case', () => {
  it('do something should return the forth power of the passed param', () => {
    const actual = doSomething(2);
    expect(actual).to.be.eql(16);
  });
  it('doSomethingAsynchronous with delay should return the fourth power of the passed param', async () => {
    const actual = await doSomethingAsynchronous(2);
    expect(actual).to.be.eql(16);
  });
});
