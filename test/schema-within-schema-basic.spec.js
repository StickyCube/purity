"use strict";

var expect = require('chai').expect;
var Schema = require('../index').Schema;

describe('Schemas', function () {
	var innerSchema = new Schema({ name: { $type: String, $required: true }, age: { $type: Number } });
	var mainSchema = new Schema({
		person: innerSchema
	});

	describe('one schema inside another\'s definition', function () {
		it('should validate corretly with good data', function () {
			var data = { person: { name: 'foo', age: 21 } };
			mainSchema.validate(data, function (err, data) {
				expect(err).to.be.null;
				expect(data).to.be.a('object');
				expect(data.person.name).to.equal('foo');
				expect(data.person.age).to.equal(21);
			});
		});

		it('should not validate bad data', function () {
			var data = { person: { name: 'bar', age: '21' } };
			mainSchema.validate(data, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.invalid).to.have.length(1);
				expect(err.invalid).to.have.all.members(['person.age']);
			});
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
				expect(err).to.be.null;
				expect(res).to.be.a('object');
				expect(res.person.name).to.equal('Tony');
				expect(res.address.city).to.equal('London');
				expect(res.address.houseNumber).to.equal(23);
			});
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
				expect(err).to.be.a('object');
				expect(err.missing).to.have.length(1);
				expect(err.invalid).to.have.length(1);
				expect(err.missing).to.have.all.members(['person.name']);
				expect(err.invalid).to.have.all.members(['address.houseNumber']);
			});
		});
	});

});