"use strict";

var utils = require('./utils');
var isValue = utils.isValue;
var isArray = utils.isArray;
var isObject = utils.isObject;
var isFunction = utils.isFunction;
var isEnumerable = utils.isEnumerable;
var clone = utils.clone;

/**
 * [Validator description]
 * @param {[type]} element [description]
 * @param {[type]} path    [description]
 */
function Validator (element, path) {

	if (isFunction(element)) {
		element = { $type: element };
	}

	path = path || '';
	this.element = element;
	this.path = path;

	switch (element.$type.name) {
		case 'String': makeStringValidator(this); break;
		case 'Number': makeNumberValidator(this); break;
		default: break;
	}

	element.$required = Boolean(element.$required);
}

Validator.prototype.constructor = Validator;

Validator.prototype.element;

Validator.prototype.path;

Validator.prototype.validate = function (data, callback) {
	var error = null
		, result = data;

	if (isValue(data)) {

		if (this.element.$mutator) {
			data = this.element.$mutator(data);
		}		

		if (this.element.$castTo) {
			result = castToType(data, this.element.$castTo);
			if (!isValue(data)) {
				return callback({ invalid: [this.path] }, data);
			}
		} else if (data.constructor !== this.element.$type) {
			return callback({ invalid: [this.path] }, data)
		}

		return this.validateType(data, callback);
	}

	if (this.element.$required) {
		error = { missing: [this.path] };
	}

	if (isDefined(this.element.$default)) {
		result = getDefaultValue(this.element.$default);
		error = null;
	}

	callback(error, result);
};

Validator.prototype.validateType = function (data, callback) {
	callback(null, data);
}

function makeStringValidator (v) {
	var element = v.element;

	if ((element.$minlength || 0) < 1) 	element.$minlength = -1;
	if ((element.$maxlength || 0) < 1) 	element.$maxlength = Infinity;
	if ((element.$fixedwidth || 0) < 1) element.$fixedwidth = 0;
	element.$tolower = Boolean(element.$tolower);
	element.$toupper = Boolean(element.$toupper);

	v.validateType = function (data, callback) {
		if (data.constructor !== String) {
			if (!this.element.$cast) {
				return callback({ invalid: [this.path] }, data);
			}
			data = data.toString();
		}

		if (this.element.$tolower) { 
			data = data.toLowerCase();
		}

		if (this.element.$toupper) {
			data = data.toUpperCase();
		}

		if (data.length < this.element.$minlength) {
		 	return callback({ invalid: [this.path] }, data);
		}
		
		if (data.length > this.element.$maxlength) {
			return callback({ invalid: [this.path] }, data);
		}

		if (this.element.$fixedwidth && this.element.$fixedwidth !== data.length) {
			return callback({ invalid: [this.path] }, data);
		}

		if (this.element.$regex && !this.element.$regex.test(data)) {
			return callback({ invalid: [this.path] }, data);
		}

		callback(null, data);
	};
}

function makeNumberValidator (v) {
	var element = v.element;

	if (!isNumber(element.$gt)) element.$gt = -Infinity;
	if (!isNumber(element.$gte)) element.$gte = -Infinity;
	if (!isNumber(element.$lt)) element.$lt = Infinity;
	if (!isNumber(element.$lte)) element.$lte = Infinity;
	if (!isNumber(element.$mod) || element.$mod < 1) element.$mod = Infinity;
	if (!isNumber(element.$tofixed) || element.$tofixed < 0 || element.$tofixed > 20) element.$tofixed = 0;
	element.$integer = Boolean(element.$integer);
	element.$abs 	= Boolean(element.$abs);
	element.$neg 	= Boolean(element.$neg);

	v.validateType = function (data, callback) {

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
			return callback({ invalid: [this.path] }, data);
		}

		if (data < this.element.$gte) {
			return callback({ invalid: [this.path] }, data);
		}

		if (data >= this.element.$lt) {
			return callback({ invalid: [this.path] }, data);
		}

		if (data > this.element.$lte) {
			return callback({ invalid: [this.path] }, data);
		}

		callback(null, data);
	};
}

module.exports = exports = Validator;

function castToType (v, ctor) {
	var data;
	try {
		data = new ctor(v);
		if (!isValue(data)) {
			data = null;
		}
	} catch (e) {
		data = null;
	}
	return data;
}

function isNumber (v) {
	return isValue(v) && v.constructor === Number;
}

function isDefined (v) {
	return v !== undefined;
}

function getDefaultValue (v) {
	if (isFunction(v)) {
		return v();
	}
	return clone(v);
}