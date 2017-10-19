var expect = require("chai").expect;
require("../lib/arrays");

describe("Test Arrays utilities", function() {
    describe("isArray", function() {
		it("checks correctly", function() {
			expect(isArray([])).to.equal(true);
			expect(isArray([1,2,3])).to.equal(true);
			expect(isArray(['1','2','3'])).to.equal(true);
			expect(isArray({})).to.equal(false);
			expect(isArray([{}])).to.equal(true);
			expect(isArray(null)).to.equal(false);
			expect(isArray(undefined)).to.equal(false);
			expect(isArray(()=>{})).to.equal(false);
		});
    });
    describe("isEmptyArray", function() {
		it("checks correctly", function() {
			expect(isEmptyArray([])).to.equal(true);
			expect(isEmptyArray([1,2,3])).to.equal(false);
			expect(isEmptyArray(['1','2','3'])).to.equal(false);
			expect(isEmptyArray({})).to.equal(false);
			expect(isEmptyArray([{}])).to.equal(false);
			expect(isEmptyArray(null)).to.equal(false);
			expect(isEmptyArray(undefined)).to.equal(false);
			expect(isEmptyArray(()=>{})).to.equal(false);
		});
    });
});