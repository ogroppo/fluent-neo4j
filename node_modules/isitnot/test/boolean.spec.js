var expect = require("chai").expect;
require("../lib/boolean");

describe("Test Bool utilities", function() {
    describe("isBoolean", function() {
		it("checks correctly", function() {
			expect(isBoolean('')).to.equal(false);
			expect(isBoolean(true)).to.equal(true);
			expect(isBoolean(false)).to.equal(true);
			expect(isBoolean({})).to.equal(false);
			expect(isBoolean(null)).to.equal(false);
			expect(isBoolean(1)).to.equal(false);
			expect(isBoolean(new Boolean())).to.equal(true);
			expect(isBoolean(new Boolean(1))).to.equal(true);
			expect(isBoolean(new Boolean(''))).to.equal(true);
			expect(isBoolean(Boolean())).to.equal(true);
			expect(isBoolean(Boolean)).to.equal(false); //function
		});
    });
});