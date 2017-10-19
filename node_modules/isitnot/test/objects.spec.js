var expect = require("chai").expect;
require("../lib/objects");

describe("Test Object utilities", function() {
    describe("isObject", function() {
		it("checks correctly", function() {
			expect(isObject([])).to.equal(false);
			expect(isObject({})).to.equal(true);
			expect(isObject(['1','2','3'])).to.equal(false);
			expect(isObject({a:"b"})).to.equal(true);
			expect(isObject(0)).to.equal(false);
			expect(isObject(null)).to.equal(false);
			expect(isObject(undefined)).to.equal(false);
			expect(isObject(()=>{})).to.equal(false);
		});
    });
    describe("isEmptyObject", function() {
		it("checks correctly", function() {
			expect(isEmptyObject([])).to.equal(false);
			expect(isEmptyObject({})).to.equal(true);
			expect(isEmptyObject(['1','2','3'])).to.equal(false);
			expect(isEmptyObject({a:"b"})).to.equal(false);
			expect(isEmptyObject(0)).to.equal(false);
			expect(isEmptyObject(null)).to.equal(false);
			expect(isEmptyObject(undefined)).to.equal(false);
			expect(isEmptyObject(()=>{})).to.equal(false);
		});
    });
});