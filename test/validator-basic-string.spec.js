"use strict";

var expect 		= require('chai').expect;
var Validator = require('../lib/validator');

describe('Validator - String', function () {
	
	var error, result;

	before(function () {
		error = result = undefined;
	});

	describe('No options', function () {
		var validator;
		before(function () {
			var BasicElement = { $type: String };
			validator = new Validator(BasicElement, 'test');
		});

		it('should pass null unchanged', function () {
			validator.validate(null, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal(null);
		});

		it('should pass undefined unchanged', function () {
			validator.validate(undefined, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal(undefined);
		});

		it('should pass an empty string unchanged', function () {
			validator.validate('', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('');
		});

		it('should pass a valid string unchanged', function () {
			validator.validate('foo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foo');
		});

		it('should fail to validate a boolean', function () {
			validator.validate(true, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.invalid[0]).to.equal('test');
			expect(error.missing).to.not.exist;
			expect(result).to.equal(true);

			validator.validate(false, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.invalid[0]).to.equal('test');
			expect(error.missing).to.not.exist;
			expect(result).to.equal(false);
		});

		it('should fail to validate a number', function () {
			validator.validate(123, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.invalid[0]).to.equal('test');
			expect(error.missing).to.not.exist;
			expect(result).to.equal(123);

			validator.validate(0, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.invalid[0]).to.equal('test');
			expect(error.missing).to.not.exist;
			expect(result).to.equal(0);
		});
	});

	describe('Required option', function () {
		var validator;
		var RequiredElement = { $type: String, $required: true };

		before(function () {
			validator = new Validator(RequiredElement, 'test');
		});

		it('should fail to validate null', function () {
			validator.validate(null, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.missing[0]).to.equal('test');
			expect(error.invalid).to.not.exist;
			expect(result).to.equal(null);
		});

		it('should fail to validate undefined', function () {
			validator.validate(undefined, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.missing[0]).to.equal('test');
			expect(error.invalid).to.not.exist;
			expect(result).to.equal(undefined);
		});

		it('should pass an empty string unchanged', function () {
			validator.validate('', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('');
		});

		it('should pass a valid string unchanged', function () {
			validator.validate('foo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foo');
		});
	});

	describe('Default option', function () {
		var validator;
		var DefaultElement = { $type: String, $default: 'bar' };

		before(function () {
			validator = new Validator(DefaultElement, 'test');
		});

		it('should validate null and give a default', function () {
			validator.validate(null, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('bar');
		});

		it('should validate undefined and give a default', function () {
			validator.validate(undefined, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('bar');
		});

		it('should pass an empty string unchanged', function () {
			validator.validate('', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('');
		});

		it('should pass a valid string unchanged', function () {
			validator.validate('foo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foo');
		});
	});
	
	describe('minlength option', function () {
		var validator;
		var DefaultElement = { $type: String, $minlength: 5 };

		before(function () {
			validator = new Validator(DefaultElement, 'test');
		});

		it('should fail to validate a short string', function () {
			validator.validate('foo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.missing).to.be.missing;
			expect(error.invalid[0]).to.equal('test');
			expect(result).to.equal('foo');
		});

		it('should validate a string with the same length', function () {
			validator.validate('foooo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foooo');
		});

		it('should validate a long string', function () {
			validator.validate('foobar', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foobar');
		});
	});

	describe('maxlength option', function () {
		var validator;
		var DefaultElement = { $type: String, $maxlength: 5 };

		before(function () {
			validator = new Validator(DefaultElement, 'test');
		});

		it('should validate a short string', function () {
			validator.validate('foo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foo');
		});

		it('should validate a string with the same length', function () {
			validator.validate('foooo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foooo');
		});

		it('should fail to validate a long string', function () {
			validator.validate('foobar', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.missing).to.be.missing;
			expect(error.invalid[0]).to.equal('test');
			expect(result).to.equal('foobar');
		});
	});

	describe('fixedwidth option', function () {
		var validator;
		var DefaultElement = { $type: String, $fixedwidth: 3 };

		before(function () {
			validator = new Validator(DefaultElement, 'test');
		});

		it('should fail to validate a short string', function () {
			validator.validate('fo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.missing).to.be.missing;
			expect(error.invalid[0]).to.equal('test');
			expect(result).to.equal('fo');
		});

		it('should fail to validate a long string', function () {
			validator.validate('foobar', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.missing).to.be.missing;
			expect(error.invalid[0]).to.equal('test');
			expect(result).to.equal('foobar');
		});

		it('should validate a string with the same length', function () {
			validator.validate('foo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foo');
		});
	});

	describe('regex option', function () {
		var validator;
		var DefaultElement = { $type: String, $regex: /(foo|bar)/ };

		before(function () {
			validator = new Validator(DefaultElement, 'test');
		});

		it('should fail to validate an unmatched string', function () {
			validator.validate('fo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.missing).to.be.missing;
			expect(error.invalid[0]).to.equal('test');
			expect(result).to.equal('fo');
		});

		it('should validate a matched string', function () {
			validator.validate('foo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foo');
		});
	});

	describe('tolower option', function () {
		var validator;
		var DefaultElement = { $type: String, $tolower: true };

		before(function () {
			validator = new Validator(DefaultElement, 'test');
		});

		it('should convert an all upper string', function () {
			validator.validate('FOO', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foo');
		});

		it('should convert a mixed string', function () {
			validator.validate('fOo@BaR', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foo@bar');
		});

		it('should leave a lower string unchanged', function () {
			validator.validate('foobar', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('foobar');
		});
	});

	describe('toupper option', function () {
		var validator;
		var DefaultElement = { $type: String, $toupper: true };

		before(function () {
			validator = new Validator(DefaultElement, 'test');
		});

		it('should convert an all lower string', function () {
			validator.validate('foo', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('FOO');
		});

		it('should convert a mixed string', function () {
			validator.validate('fOo@BaR', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('FOO@BAR');
		});

		it('should leave an upper string unchanged', function () {
			validator.validate('FOOBAR', function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.equal(null);
			expect(result).to.equal('FOOBAR');
		});
	});
});