function Test (data) {
	this.data = data;
}

Test.prototype.constructor = Test;

var Schema = require('../index').Schema;
var expect = require('chai').expect;

describe('Schema - $castTo option', function () {

	var schema = new Schema({ data: { $type: String, $castTo: Test } });

	it('should cast data to Test', function () {
		schema.cleanse({ data: 'foo' }, function (e, r) {
			expect(e).to.be.null;
			expect(r.data.constructor).to.equal(Test);
			expect(r.data.data).to.equal('foo');
		});
	});

	var arraySchema = new Schema({ data: [ { $type: String, $castTo: Test } ] })
	it('should cast arrays of data to Test', function () {
		arraySchema.cleanse({ data: ['foo', 'bar', 'baz'] }, function (e, r) {
			expect(e).to.be.null;
			expect(r.data).to.have.length(3);
			expect(r.data[0] instanceof Test).to.be.true;
			expect(r.data[1] instanceof Test).to.be.true;
			expect(r.data[2] instanceof Test).to.be.true;
		});
	});
});