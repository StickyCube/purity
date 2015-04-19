function Test (d) {
	this.d = d;
}

Test.prototype.constructor = Test;

var Schema = require('../index').Schema;
var expect = require('chai').expect;

describe('Schema - $castTo', function () {

	var schema = new Schema({ data: { $type: String, $castTo: Test } });

	it('should cast to instance of Test', function () {
		var err, res;
		schema.validate({ data: 'foo' }, function (e, r) {
			err = e;
			res = r;
		});

		expect(err).to.equal(null);
		expect(res.data instanceof Test).to.equal(true);

	});

});