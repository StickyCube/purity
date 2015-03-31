"use strict";

var expect 	= require('chai').expect;
var Schema 	= require('../index').Schema;

var ValidDefinition = { name: { $type: String } };
var validArrayDefinition = { name: [{ $type: String }] }
var InvalidDefinition = { name: String };

describe('Schema', function () {

	describe('#constructor', function () {
		
		describe('Invalid Definition', function () {
			it('Should throw when no definition is passed', function () {
				expect(function () {
					new Schema();
				}).to.throw();
			});

			it('Should throw when null is passed', function () {
				expect(function () {
					new Schema(null);
				}).to.throw();
			});

			it('Should throw when an empty object is passed', function () {
				expect(function () {
					new Schema({});
				}).to.throw();
			});

			it('Should throw when a number is passed', function () {
				expect(function () {
					new Schema(123);
				}).to.throw();
			});

			it('Should throw when a boolean is passed', function () {
				expect(function () {
					new Schema(true);
				}).to.throw();
			});

			it('Should throw when a string is passed', function () {
				expect(function () {
					new Schema('foo');
				}).to.throw();
			});

			it('Should throw when an array is passed', function () {
				expect(function () {
					new Schema([]);
				}).to.throw();
			});

			it('Should throw when an Invalid definition is passed', function () {
				expect(function () {
					new Schema(InvalidDefinition);
				}).to.throw();
			});

			it('Should not throw when a valid definition is passed', function () {
				expect(function () {
					new Schema(ValidDefinition);
				}).not.to.throw();
			});

			it('Should not throw when an array of a valid definition is passed', function () {
				expect(function () {
					new Schema(validArrayDefinition);
				}).not.to.throw();
			});
		});

		describe('Schema Validation', function () {
			var schema = new Schema({
				name: { $type: String, $required: true },
				address: {
					country: { $type: String, $required: true },
					city: { $type: String, $default: 'London' }
				}
			});

			it('should validate corretly', function () {
				var data = {
					name: 'Will',
					address: { country: 'UK' }
				};
				var result = schema.validate(data, function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.be.a('object');
					expect(res.address).to.be.a('object');
					expect(res.address.country).to.equal('UK');
					expect(res.address.city).to.equal('London');
					expect(res.name).to.equal('Will');
				});
			});
		});
	});
});