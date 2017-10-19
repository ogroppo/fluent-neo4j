var expect = require('chai').expect;
require('../lib/dates');

describe('Test Date utilities', () => {
  describe('isDate', () => {
    it('detects bad arguments', () =>
      runTest(
        [false, 0, null, undefined, NaN, '', [], true, {}],
        isDate,
        false
      ));

    it('correctly evaluates an instance of Date', () =>
      // runTest(new Date([1, 2, 3]), isDate, false); -> in an ideal world
      runTest([new Date(), new Date([1, 2, 3])], isDate, true));

    it('detects an invalid instance of Date', () => {
      runTest(
        [
          new Date('Invalid Date'),
          (() => {
            // Recreate a scenario in which Date as been overwritten.
            function Date() {
              return {
                type: 'Romantic',
                with: 'That person I fancy'
              };
            }
            return isDate(new Date());
          })()
        ],
        isDate,
        false
      );
    });

    it('detects well formatted date strings (ISO format)', () =>
      runTest(
        [
          '1970-01-01',
          '  1970-01-01  ',
          '  	1970-01-01 	 ',
          '1970-01-01T00:00',
          '1970-01-01T00:00:00',
          '1970-01-01T00:00:00.000Z',
          '1970-01-01T23:59:50.999Z'
        ],
        isDate,
        true
      ));

    it('detects invalid date strings', () =>
      runTest(
        [
          '1970-13-01',
          '1970-12-32',
          '2017-02-29',
          '1970-01-01T',
          '1970/01-01T00',
          '1970/01-01T00:',
          '1970-01-01T24:00:00.000Z',
          '1970-01-01T00:60:00.000Z',
          '1970-01-01T00:00:60.000Z',
          '0-01-01T00:00:00.000Z',
          '19-01-01T00:00:00.000Z',
          '197-01-01T00:00:00.000Z',
          '1970-01-01T00:00:00.1000Z',
          '19700-01-01T00:00:00.000Z'
        ],
        isDate,
        false
      ));

    function runTest(testValues, functionToTest, expectedResult) {
      testValues = Array.isArray(testValues) ? [...testValues] : [testValues];

      const actualResult = [false, ...testValues].reduce(
        (previousResult, value) => !!previousResult || functionToTest(value)
      );

      return expect(actualResult).to.equal(expectedResult);
    }
  });
});
