"use strict";

// var utils = require('../purity-utils');

module.exports = function (validator) {
	init(validator.element);
	validator.validateType = validate.bind(validator);
}

function init (element) {
	if ((element.minlength || 0) < 1) 	element.minlength = -1;
	if ((element.maxlength || 0) < 1) 	element.maxlength = Infinity;
	if ((element.fixedwidth || 0) < 1) 	element.fixedwidth = 0;
	element.tolower = Boolean(element.tolower);
	element.toupper = Boolean(element.toupper);
}

function validate (data, callback) {
	if (data.constructor !== String) {
		if (!this.element.cast) {
			return callback({ invalid: true }, null);
		}
		data = data.toString();
	}

	if (this.element.tolower) { 
		data = data.toLowerCase();
	}

	if (this.element.toupper) {
		data = data.toUpperCase();
	}

	if (data.length < this.element.minlength) {
	 	return callback({ invalid: true }, null);
	}
	
	if (data.length > this.element.maxlength) {
		return callback({ invalid: true }, null);
	}

	if (this.element.fixedwidth && this.element.fixedwidth !== data.length) {
		return callback({ invalid: true }, null);
	}

	if (this.element.regex && !this.element.regex.test(data)) {
		return callback({ invalid: true }, null);
	}

	callback(null, data);
}