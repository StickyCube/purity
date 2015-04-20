var Schema = require('../index').Purity;
var expect = require('chai').expect;


describe('Schema - $cast option', function () {
	it('should fail to validate when given the wrong type', function () {
		var schema = new Schema({ data: { $type: Number } })
		schema.validate({ data: '123' }, function (e, r) {
			expect(e).to.be.a('object');
			expect(e.invalid).to.have.length(1);
			expect(e.invalid).to.have.all.members(['data']);
		});
	});

	it('should cast data with the option', function () {
		var schema = new Schema({ data: { $type: Number, $cast: true } })
		schema.validate({ data: '123' }, function (e, r) {
			expect(e).to.be.null
			expect(r.data).to.be.a('number');
			expect(r.data).to.equal(123);
			// expect(e.invalid).to.have.length(1);
			// expect(e.invalid).to.have.all.members(['data']);
		});
	});

});