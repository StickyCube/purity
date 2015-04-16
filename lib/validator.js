"use strict";

var _ = require('underscore');

/**
 * [Validator description]
 * @param {[type]} element [description]
 * @param {[type]} path    [description]
 */
function Validator (element, path) {
	path = path || '';
	this.element = element;
	this.path = path;

	switch (element.$type.name) {
		case 'String': makeStringValidator(this); break;
		case 'Number': makeNumberValidator(this); break;
		case 'Boolean': makeBooleanValidator(this); break;
		default: throw new Error('Unrecognised type ' + element.$type.name);
	}

	element.$cast = Boolean(element.$cast);
	element.$required = Boolean(element.$required);
}

Validator.prototype.constructor = Validator;

Validator.prototype.element;

Validator.prototype.path;

Validator.prototype.validate = function (data, callback) {
		var error = null
			, result = data
			, array = isArray(data);
		
		if (isValue(data) && !array) {

			if (this.element.$mutator) {
				data = this.element.$mutator(data);
			}

			this.validateType(data, callback);
			return;
		}

		if (this.element.$required) {
			error = { missing: [this.path] };
		}

		if (array) {
			error = { invalid: [this.path] };
		}

		if (isDefined(this.element.$default)) {
			result = getDefaultValue(this.element.$default);
			error = null;
		}

		callback(error, result);
};

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
		if (data.constructor !== Number) {
			if (this.element.$cast) {
				data = parseFloat(data);
			}

			if (!this.element.$cast || data === NaN) {
				return callback({ invalid: [this.path] }, data);
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

function makeBooleanValidator (v) {
	v.validateType = function (data, callback) {
		if (data.constructor !== Boolean) {
			if (this.element.$cast) {
				data = parseFloat(data);
			}

			if (!this.element.$cast || data === NaN) {
				return callback({ invalid: [this.path] }, data);
			}
		}
		callback(null, data);
	};
}

module.exports = exports = Validator;

function isValue (v) {
	return v !== undefined && v !== null && v !== NaN;
}

function isArray (v) {
	return v instanceof Array;
}

function isObject (v) {
	return isValue(v) && v.constructor === Object;
}

function isNumber (v) {
	return isValue(v) && v.constructor === Number;
}

function isFunction (v) {
	return typeof v === 'function';
}

function isDefined (v) {
	return v !== undefined;
}

function isEnumerable (v) {
	return isObject(v) || isArray(v);
}

function clone (v) {
	if (isEnumerable(v)) {
		var data = new v.constructor;
		_.each(v, function (val, key) {
			data[key] = clone(val);
		});
		return data;
	} else if (isFunction(v)) {
		return v;
	}

	return _.clone(v);
}

function getDefaultValue (v) {
	if (isFunction(v)) {
		return v();
	}
	return clone(v);
}