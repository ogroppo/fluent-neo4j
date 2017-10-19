var expect = require("chai").expect;
require("../lib/strings");

describe("Test Strings utilities", function() {
    describe("isString", function() {
      it("checks correctly", function() {
        expect(isString('string')).to.equal(true);
        expect(isString('')).to.equal(true);
        expect(isString(' ')).to.equal(true);
        expect(isString('-33')).to.equal(true);
        expect(isString('2e12')).to.equal(true);
        expect(isString('\t\t')).to.equal(true);
        expect(isString('\n\r')).to.equal(true);
        expect(isString(Infinity)).to.equal(false);
        expect(isString(-Infinity)).to.equal(false);
        expect(isString(null)).to.equal(false);
        expect(isString(undefined)).to.equal(false);
        expect(isString({})).to.equal(false);
        expect(isString([])).to.equal(false);
        expect(isString(0)).to.equal(false);
        expect(isString(000)).to.equal(false);
      });
    });
    describe("isEmptyString", function() {
      it("checks correctly", function() {
        expect(isEmptyString('string')).to.equal(false);
        expect(isEmptyString('')).to.equal(true);
        expect(isEmptyString(' ')).to.equal(true);
        expect(isEmptyString(' - ')).to.equal(false);
        expect(isEmptyString('\t\t')).to.equal(true);
        expect(isEmptyString('\n\r')).to.equal(true);
        expect(isEmptyString(null)).to.equal(false);
        expect(isEmptyString(undefined)).to.equal(false);
        expect(isEmptyString({})).to.equal(false);
        expect(isEmptyString([])).to.equal(false);
        expect(isEmptyString(0)).to.equal(false);
        expect(isEmptyString(000)).to.equal(false);
      });
    });
    describe("isStringAndNotEmpty", function() {
      it("checks correctly", function() {
        expect(isStringAndNotEmpty('')).to.equal(false);
        expect(isStringAndNotEmpty(' ')).to.equal(false);
        expect(isStringAndNotEmpty('a')).to.equal(true);
        expect(isStringAndNotEmpty([])).to.equal(false);
        expect(isStringAndNotEmpty({})).to.equal(false);
        expect(isStringAndNotEmpty(11)).to.equal(false);
      });
    });
    describe("isEmail", function() {
      it("checks correctly", function() {
        expect(isEmail('a@a.a')).to.equal(true);
        expect(isEmail('1@1.com')).to.equal(true);
        expect(isEmail('1@1-1.com')).to.equal(true);
        expect(isEmail('string')).to.equal(false);
        expect(isEmail('@')).to.equal(false);
        expect(isEmail(' @.')).to.equal(false);
        expect(isEmail('@ma.com')).to.equal(false);
        expect(isEmail('d@\t\t.t')).to.equal(false);
        expect(isEmail('\n\r@gmail.com')).to.equal(false);
        expect(isEmail(null)).to.equal(false);
        expect(isEmail(undefined)).to.equal(false);
        expect(isEmail({})).to.equal(false);
        expect(isEmail([])).to.equal(false);
        expect(isEmail(0)).to.equal(false);
        expect(isEmail(000)).to.equal(false);
      });
    });
    describe("isVariableName", function() {
      it("checks correctly", function() {
        expect(isVariableName('a@a.a')).to.equal(false);
        expect(isVariableName('')).to.equal(false);
        expect(isVariableName(' ')).to.equal(false);
        expect(isVariableName(' a')).to.equal(false);
        expect(isVariableName('0var')).to.equal(false);
        expect(isVariableName('myVar')).to.equal(true);
        expect(isVariableName('var')).to.equal(true);
        expect(isVariableName('const')).to.equal(true);
        expect(isVariableName('let')).to.equal(true);
        expect(isVariableName('let_let')).to.equal(true);
        expect(isVariableName('let let')).to.equal(false);
      });
    });
});
