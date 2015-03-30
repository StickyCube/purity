"use strict";

var expect = require('chai').expect;
var Validator = require('../lib/validator');


describe('Validator - Boolean', function () {
	var validator;

	before(function () {
		validator = new Validator({ $type: Boolean })
	});

	it('should validate true and false', function () {
		validator.validate(true, function (err, res) {
			expect(err).to.be.null;
			expect(res).to.equal(true);
		});

		validator.validate(false, function (err, res) {
			expect(err).to.be.null;
			expect(res).to.equal(false);
		});
	});

	it('should not validate a string', function () {
		validator.validate('foo', function (err, res) {
			expect(err).to.be.a('object');
			expect(err.missing).to.be.missing;
			expect(err.invalid).to.equal(true);
			expect(res).to.be.null;
		});
	});

	it('should not validate a number', function () {
		validator.validate(1234, function (err, res) {
			expect(err).to.be.a('object');
			expect(err.missing).to.be.missing;
			expect(err.invalid).to.equal(true);
			expect(res).to.be.null;
		});
	});

});