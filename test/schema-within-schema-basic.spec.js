"use strict";

var expect = require('chai').expect;
var Schema = require('../index').Purity;

describe('Schemas', function () {
	var error, result;
	var innerSchema = new Schema({ name: { $type: String, $required: true }, age: { $type: Number } });
	var mainSchema = new Schema({
		person: innerSchema
	});

	before(function () {
		error = result = undefined;
	});

	describe('one schema inside another\'s definition', function () {
		it('should validate corretly with good data', function () {
			var data = { person: { name: 'foo', age: 21 } };
			mainSchema.validate(data, function (err, data) {
				error = err;
				result = data;
			});
			expect(error).to.be.null;
			expect(result).to.be.a('object');
			expect(result.person.name).to.equal('foo');
			expect(result.person.age).to.equal(21);
		});

		it('should not validate bad data', function () {
			var data = { person: { name: 'bar', age: '21' } };
			mainSchema.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.invalid).to.have.length(1);
			expect(error.invalid).to.have.all.members(['person.age']);
		});
	});

	var addressSchema = new Schema({
		city: { $type: String, $required: true },
		houseNumber: { $type: Number, $gt: 1, $required: true },
		street: { $type: String }
	});

	var mainSchema2 = new Schema({
		person: innerSchema,
		address: addressSchema
	});

	describe('two Schemas inside another\'s definition', function () {
		it('should validate corretly with good data', function () {
			var data = {
				person: { name: 'Tony' },
				address: {
					city: 'London',
					houseNumber: 23
				}
			};

			mainSchema2.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result).to.be.a('object');
			expect(result.person.name).to.equal('Tony');
			expect(result.address.city).to.equal('London');
			expect(result.address.houseNumber).to.equal(23);
		});

		it('should fail to validate with bad data', function () {
			var data = {
				person: { age: 24 },
				address: {
					city: 'London',
					houseNumber: -12,
					street: 'SomeRoad St'
				}
			};

			mainSchema2.validate(data, function (err, res) {
				error = err;
				result = res;
			});


			expect(error).to.be.a('object');
			expect(error.missing).to.have.length(1);
			expect(error.invalid).to.have.length(1);
			expect(error.missing).to.have.all.members(['person.name']);
			expect(error.invalid).to.have.all.members(['address.houseNumber']);
		});
	});

});