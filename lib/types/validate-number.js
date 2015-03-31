"use strict";

var utils = require('../purity-utils');

module.exports = function (validator) {
	init(validator.element);
	validator.validateType = validate.bind(validator);
};

function init (element) {
	if (!utils.isNumber(element.$gt)) element.$gt = -Infinity;
	if (!utils.isNumber(element.$gte)) element.$gte = -Infinity;
	if (!utils.isNumber(element.$lt)) element.$lt = Infinity;
	if (!utils.isNumber(element.$lte)) element.$lte = Infinity;
	if (!utils.isNumber(element.$mod) || element.$mod < 1) element.$mod = Infinity;
	if (!utils.isNumber(element.$tofixed) || element.$tofixed < 0 || element.$tofixed > 20) element.$tofixed = 0;
	element.$integer = Boolean(element.$integer);
	element.$abs 	= Boolean(element.$abs);
	element.$neg 	= Boolean(element.$neg);
}

function validate (data, callback) {
	if (data.constructor !== Number) {
		if (this.element.$cast) {
			data = parseFloat(data);
		}

		if (!this.element.$cast || data === NaN) {
			return callback({ invalid: true }, null);
		}
	}

	if (this.element.$integer) {
		data = parseInt(data);
	}

	if (this.element.$tofixed) {
		data = +data.toFixed(this.element.$tofixed);
	}

	if (this.element.$abs) {
		data = Math.abs(data);
	}

	if (this.element.$neg) {
		data = (- Math.abs(data));
	}

	data %= this.element.$mod;

	if (data <= this.element.$gt) {
		return callback({ invalid: true }, null);
	}

	if (data < this.element.$gte) {
		return callback({ invalid: true }, null);
	}

	if (data >= this.element.$lt) {
		return callback({ invalid: true }, null);
	}

	if (data > this.element.$lte) {
		return callback({ invalid: true }, null);
	}

	callback(null, data);
}
