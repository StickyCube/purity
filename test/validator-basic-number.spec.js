"use strict";

var expect 		= require('chai').expect;
var Validator 	= require('../lib/validator');

describe('Validator - Number', function () {
	describe('No Options', function () {
		var validator;

		before(function () {
			var Element = { $type: Number };
			validator = new Validator(Element);
		});

		it('should validate null without modifying', function () {
			validator.validate(null, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(null);
			});
		});

		it('should validate undefined without modifying', function () {
			validator.validate(undefined, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(undefined);
			});
		});

		it('should fail to validate a string', function () {
			validator.validate('foobar', function (err, res) {
				expect(err).to.be.a('object');
				expect(err.invalid).to.equal(true);
				expect(err.missing).to.be.missing;
				expect(res).to.equal(null);
			});

			validator.validate('', function (err, res) {
				expect(err).to.be.a('object');
				expect(err.invalid).to.equal(true);
				expect(err.missing).to.be.missing;
				expect(res).to.equal(null);
			});
		});

		it('should fail to validate a boolean', function () {
			validator.validate(true, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.invalid).to.equal(true);
				expect(err.missing).to.be.missing;
				expect(res).to.equal(null);
			});

			validator.validate(false, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.invalid).to.equal(true);
				expect(err.missing).to.be.missing;
				expect(res).to.equal(null);
			});
		});
 	});

	describe('Integer option', function () {
		var validator;
		before(function () {
			var Element = { $type: Number, integer: true };
			validator = new Validator(Element);
		});

		it('should validate an integer unchanged', function () {
			validator.validate(123, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123);
			});
		});


		it('should validate zero unchanged', function () {
			validator.validate(0, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(0);
			});
		});

		it('should validate and modify a float', function () {
			validator.validate(123.456, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123);
			});
		});

		it('should validate a negative integer unchanged', function () {
			validator.validate(-123, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-123);
			});
		});

		it('should validate and modify a negative float', function () {
			validator.validate(-123.456, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-123);
			});
		});

	});

	describe('tofixed option', function () {
		var validator;
		before(function () {
			var Element = { $type: Number, tofixed: 2 };
			validator = new Validator(Element);
		});

		it('should validate an integer unchanged', function () {
			validator.validate(123, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123);
			});
		});


		it('should validate zero unchanged', function () {
			validator.validate(0, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(0);
			});
		});
	
		it('should validate a negative integer unchanged', function () {
			validator.validate(-123, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-123);
			});
		});

		it('should validate and modify a long decimal float', function () {
			validator.validate(123.456789, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123.46);
			});
		});

		it('should validate a a short decimal float', function () {
			validator.validate(123.4, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123.4);
			});
		});

		it('should validate a a float with a decimal of the same length', function () {
			validator.validate(123.42, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123.42);
			});
		});

		it('should validate and modify a negative float', function () {
			validator.validate(-123.456, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-123.46);
			});
		});
	});

	describe('abs option', function () {
		var validator;

		before(function () {
			var Element = { $type: Number, abs: true };
			validator = new Validator(Element);
		});

		it('should validate zero', function () {
			validator.validate(0, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(0);
			});
		});

		it('should validate positive integers', function () {
			validator.validate(123, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123);
			});
		});

		it('should validate positive floats', function () {
			validator.validate(123.456, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123.456);
			});
		});

		it('should validate and modify negative integers', function () {
			validator.validate(-123, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123);
			});
		});

		it('should validate and modify negative floats', function () {
			validator.validate(-123.456, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(123.456);
			});
		});
	});

	describe('neg option', function () {
		var validator;

		before(function () {
			var Element = { $type: Number, neg: true };
			validator = new Validator(Element);
		});

		it('should validate zero', function () {
			validator.validate(0, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(0);
			});
		});

		it('should validate and modify positive integers', function () {
			validator.validate(123, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-123);
			});
		});

		it('should validate and modify positive floats', function () {
			validator.validate(123.456, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-123.456);
			});
		});

		it('should validate negative integers', function () {
			validator.validate(-123, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-123);
			});
		});

		it('should validate negative floats', function () {
			validator.validate(-123.456, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-123.456);
			});
		});
	});

	describe('Modulus option', function () {
		var validator;
		before(function () {
			validator = new Validator({ $type: Number, mod: 10 });
		});

		it('should validate 0', function () {
			validator.validate(0, function (err, res) {
				expect(err).to.be.null;
				expect(res).to.equal(0);
			});
		});

		it('should validate 9', function () {
			validator.validate(9, function (err, res) {
				expect(err).to.be.null;
				expect(res).to.equal(9);
			});
		});

		it('should validate and modify 15', function () {
			validator.validate(15, function (err, res) {
				expect(err).to.be.null;
				expect(res).to.equal(5);
			});
		});

		it('should validate and modify 30', function () {
			validator.validate(30, function (err, res) {
				expect(err).to.be.null;
				expect(res).to.equal(0);
			});
		});
	});

	describe('gt option', function () {
		var validatorPos;
		var validatorNeg;
		var validatorZero;

		before(function () {
			var ElementPos = { $type: Number, gt: 10 };
			var ElementNeg = { $type: Number, gt: -10 };
			var ElementZero = { $type: Number, gt: 0 };

			validatorPos = new Validator(ElementPos);
			validatorNeg = new Validator(ElementNeg);
			validatorZero = new Validator(ElementZero);
		});

		it('should validate a number greater than the value', function () {
			validatorPos.validate(11, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(11);
			});
			validatorNeg.validate(-9, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-9);
			});
			validatorZero.validate(1, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(1);
			});
		});

		it('should not validate a number equal to the value', function () {
			validatorPos.validate(10, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorNeg.validate(-10, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorZero.validate(0, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
		});

		it('should not validate a number less than the value', function () {
			validatorPos.validate(9, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorNeg.validate(-11, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorZero.validate(-1, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
		});
	});

	describe('gte option', function () {
		var validatorPos;
		var validatorNeg;
		var validatorZero;

		before(function () {
			var ElementPos = { $type: Number, gte: 10 };
			var ElementNeg = { $type: Number, gte: -10 };
			var ElementZero = { $type: Number, gte: 0 };

			validatorPos = new Validator(ElementPos);
			validatorNeg = new Validator(ElementNeg);
			validatorZero = new Validator(ElementZero);
		});

		it('should validate a number greater than the value', function () {
			validatorPos.validate(11, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(11);
			});
			validatorNeg.validate(-9, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-9);
			});
			validatorZero.validate(1, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(1);
			});
		});

		it('should validate a number equal to the value', function () {
			validatorPos.validate(10, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(10);
			});
			validatorNeg.validate(-10, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-10);
			});
			validatorZero.validate(0, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(0);
			});
		});

		it('should not validate a number less than the value', function () {
			validatorPos.validate(9, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorNeg.validate(-11, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorZero.validate(-1, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
		});
	});

	describe('lt option', function () {
		var validatorPos;
		var validatorNeg;
		var validatorZero;

		before(function () {
			var ElementPos = { $type: Number, lt: 10 };
			var ElementNeg = { $type: Number, lt: -10 };
			var ElementZero = { $type: Number, lt: 0 };

			validatorPos = new Validator(ElementPos);
			validatorNeg = new Validator(ElementNeg);
			validatorZero = new Validator(ElementZero);
		});

		it('should validate a number less than the value', function () {
			validatorPos.validate(9, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(9);
			});
			validatorNeg.validate(-11, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-11);
			});
			validatorZero.validate(-1, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-1);
			});
		});

		it('should not validate a number equal to the value', function () {
			validatorPos.validate(10, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorNeg.validate(-10, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorZero.validate(0, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
		});

		it('should not validate a number greater than the value', function () {
			validatorPos.validate(11, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorNeg.validate(-9, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorZero.validate(1, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
		});
	});

	describe('lte option', function () {
		var validatorPos;
		var validatorNeg;
		var validatorZero;

		before(function () {
			var ElementPos = { $type: Number, lte: 10 };
			var ElementNeg = { $type: Number, lte: -10 };
			var ElementZero = { $type: Number, lte: 0 };

			validatorPos = new Validator(ElementPos);
			validatorNeg = new Validator(ElementNeg);
			validatorZero = new Validator(ElementZero);
		});

		it('should validate a number less than the value', function () {
			validatorPos.validate(9, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(9);
			});
			validatorNeg.validate(-11, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-11);
			});
			validatorZero.validate(-1, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-1);
			});
		});

		it('should validate a number equal to the value', function () {
			validatorPos.validate(10, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(10);
			});
			validatorNeg.validate(-10, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(-10);
			});
			validatorZero.validate(0, function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.equal(0);
			});
		});

		it('should not validate a number greater than the value', function () {
			validatorPos.validate(11, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorNeg.validate(-9, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
			validatorZero.validate(1, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.be.missing;
				expect(err.invalid).to.equal(true);
				expect(res).to.equal(null);
			});
		});
	});

});