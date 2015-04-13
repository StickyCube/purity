// "use strict";

// var expect = require('chai').expect;
// var Schema = require('../index').Schema;

// describe('Advanced arrays 1', function () {
// 	describe('arrays of objects', function () {

// 		var error, result;

// 		var basicObjectDefinition = {
// 			name: { $type: String },
// 			age: { $type: Number }
// 		};

// 		var schema = new Schema([basicObjectDefinition]);

// 		before(function () {
// 			error = undefined;
// 			result = undefined;
// 		});

// 		it('should validate when an empty array is passed', function () {
// 			var data = [];
// 			schema.validate(data, function (err, res) {
// 				error = err;
// 				result = res;	
// 			});
// 			expect(error).to.be.null;
// 			expect(result).to.have.length(0);
// 		});

// 		it('should validate when one good element is present', function () {
// 			var data = [ { name: 'foo', age: 1 } ];
// 			schema.validate(data, function (err, res) {
// 				error = err;
// 				result = res;
// 			});
// 			expect(error).to.be.null;
// 			expect(result).to.have.length(1);
// 			expect(result[0].name).to.equal('foo');
// 			expect(result[0].age).to.equal(1);
// 		});

// 		it('should validate when mre than one good element is present', function () {
// 			var data = [ { name: 'foo', age: 1 }, { name: 'bar', age: 2 }, { name: 'baz', age: 3 } ];
// 			schema.validate(data, function (err, res) {
// 				error = err;
// 				result = res;
// 			});
// 			expect(error).to.be.null;
// 			expect(result).to.have.length(3);
// 		});
// 	});
// });