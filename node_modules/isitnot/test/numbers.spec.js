var expect = require("chai").expect;
require("../lib/numbers");

describe("Test Numbers utilities", function() {
    describe("isNumber", function() {
      it("checks correctly", function() {
        expect(isNumber('string')).to.equal(false);
        expect(isNumber('33')).to.equal(false);
        expect(isNumber('-33')).to.equal(false);
        expect(isNumber('2e12')).to.equal(false);
        expect(isNumber('\t\t')).to.equal(false);
        expect(isNumber('\n\r')).to.equal(false);
        expect(isNumber(Infinity)).to.equal(false);
        expect(isNumber(-Infinity)).to.equal(false);
        expect(isNumber(null)).to.equal(false);
        expect(isNumber(undefined)).to.equal(false);
        expect(isNumber({})).to.equal(false);
        expect(isNumber([])).to.equal(false);
        expect(isNumber(0)).to.equal(true);
        expect(isNumber(000)).to.equal(true);
        expect(isNumber(0912312)).to.equal(true);
        expect(isNumber(12.44)).to.equal(true);
        expect(isNumber(-1244)).to.equal(true);
        expect(isNumber(2e12)).to.equal(true);
      });
    });
    describe("isInt", function() {
      it("checks correctly", function() {
        expect(isInt('string')).to.equal(false);
        expect(isInt('33')).to.equal(false);
        expect(isInt('-33')).to.equal(false);
        expect(isInt('2e12')).to.equal(false);
        expect(isInt('\t\t')).to.equal(false);
        expect(isInt('\n\r')).to.equal(false);
        expect(isInt(Infinity)).to.equal(false);
        expect(isInt(-Infinity)).to.equal(false);
        expect(isInt(null)).to.equal(false);
        expect(isInt(undefined)).to.equal(false);
        expect(isInt({})).to.equal(false);
        expect(isInt([])).to.equal(false);
        expect(isInt(0)).to.equal(true);
        expect(isInt(000)).to.equal(true);
        expect(isInt(0912312)).to.equal(true);
        expect(isInt(12.44)).to.equal(false);
        expect(isInt(-1244)).to.equal(true);
        expect(isInt(2e12)).to.equal(true);
        expect(isInt(2.44e1)).to.equal(false);
      });
    });
});
