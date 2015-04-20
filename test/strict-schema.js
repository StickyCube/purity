var Schema = require('../index').Schema;
var expect = require('chai').expect;

describe('Schema - strict option', function () {

	var opt = { strict: true };
	var schemaNoStrict = new Schema({
		name: String,
		age: Number
	});
	var schemaStrict = new Schema({
		name: String,
		age: Number
	}, opt);


	it('should allow additional fields', function () {
		var data = { name: 'foo', age: 1, bar: true };
		var e, r;
		schemaNoStrict.cleanse(data, function (err, res) {
			e = err;
			r = res;
		});

		expect(e).to.be.null;
		expect(r).to.be.a('object');
		expect(r.bar).to.equal(true);
	});

	it('should not allow additional fields', function () {
		var data = { name: 'foo', age: 1, bar: true };
		var e, r;
		schemaStrict.cleanse(data, function (err, res) {
			e = err;
			r = res;
		});

		expect(e).to.be.null;
		expect(r).to.be.a('object');
		expect(r.bar).to.be.missing;
	});

});