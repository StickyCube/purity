"use strict";

var expect = require('chai').expect;
var Validator = require('../lib/validator');


describe('Validator - Boolean', function () {
	var validator, error, result;

	before(function () {
		validator = new Validator({ $type: Boolean }, 'test')
		error = result = undefined;
	});

	it('should validate true and false', function () {
		validator.validate(true, function (err, res) {
			error = err;
			result = res;
		});
		expect(error).to.be.null;
		expect(result).to.equal(true);

		validator.validate(false, function (err, res) {
			error = err;
			result = res;
		});
		expect(error).to.be.null;
		expect(result).to.equal(false);
	});

	it('should not validate a string', function () {
		validator.validate('foo', function (err, res) {
			error = err;
			result = res;
		});
		expect(error).to.be.a('object');
		expect(error.missing).to.be.missing;
		expect(error.invalid).to.have.length(1);
		expect(error.invalid[0]).to.equal('test')
		expect(result).to.equal('foo');
	});

	it('should not validate a number', function () {
		validator.validate(1234, function (err, res) {
			error = err;
			result = res;
		});
		expect(error).to.be.a('object');
		expect(error.missing).to.be.missing;
		expect(error.invalid).to.have.length(1);
		expect(error.invalid[0]).to.equal('test')
		expect(result).to.equal(1234);
	});

});