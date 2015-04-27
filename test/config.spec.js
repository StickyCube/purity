var expect = require('chai').expect;
var purity = require('../index');
var Schema = purity.Schema;


describe('Config options', function () {
	describe('Strict', function () {

		var nonStrict = new Schema({
			name: { $type: String },
			age: { $type: Number }
		});

		it('should allow additional fields', function () {

			nonStrict.cleanse({ name: 'Bob', age: 111, foo: 'bar' }, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.be.a('object');

				var keys = Object.keys(res);
				expect(keys).to.have.length(3);
				expect(keys).to.have.all.members(['name', 'age', 'foo']);
			});
		});

		purity.config({ strict: true });
		var strict = new Schema({
			name: { $type: String },
			age: { $type: Number }
		});

		it('should remove undeclared fields', function () {
			strict.cleanse({ name: 'Bob', age: 111, foo: 'bar' }, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.be.a('object');

				var keys = Object.keys(res);
				expect(keys).to.have.length(2);
				expect(keys).to.have.all.members(['name', 'age']);
			});
		});

		purity.config({ strict: false });

	});
});