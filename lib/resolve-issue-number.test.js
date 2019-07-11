const chai          = require('chai'),
      expect        = chai.expect;

const resolveNumbers = require('./resolve-issue-number');

describe('Unit :: Issue Number Resolution', () => {
  it('should be a function', () => {
    expect(resolveNumbers).to.be.a('function');
  });

  it('should resolve a branch issue', () => {
    const cases = {
      'feature/#123-tester': [ '123' ],
      'enhancement/#22234': [ '22234' ],
      'bug/#888-someiss': [ '888' ],
      '#122': [ '122' ]
    };

    Object.keys(cases).forEach(branchName => {
      let result = resolveNumbers(branchName),
          expected = cases[branchName];

      expect(result).to.have.lengthOf(expected.length);
      expect(result).to.have.members(expected);
    });
  });

  it('should resolve a description issue', () => {
    const baseCases = {
      '[verb] #123': [ '123' ],
      '[verb] #123, #444': [ '123', '444' ],
      'heyo [verb] #123': [ '123' ],
      'heyo [verb] #123, #333, #456': [ '123', '333', '456' ]
    };

    const verbs = [ 'Closes', 'closes', 'fixes', 'fixed', 'resolves', 'resolved', 'gotem' ];

    const cases = Object.keys(baseCases).reduce((c, desc) => {
      verbs.forEach(verb => {
        c[desc.replace('[verb]', verb)] = baseCases[desc];
      })

      return c;
    }, {});

    Object.keys(cases).forEach(desc => {
      let result = resolveNumbers(desc),
          expected = cases[desc];

      expect(result).to.have.lengthOf(expected.length);
      expect(result).to.have.members(expected);
    });
  });

  it('accept multiple args for resolution', () => {
    let multiArgResult = resolveNumbers('feature/#123-test', 'also closes #455');
    expect(multiArgResult).to.have.members([ '123', '455' ]);
  });
});
