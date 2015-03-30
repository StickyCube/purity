"use strict";

var util 				= require('util');

var utils 			= require('./purity-utils')
var Validator 	= require('./validator');

function Schema (definition) {
	validateDefinition(definition);
	this.validators = createValidators(definition);
};

Schema.prototype.constructor = Schema;

Schema.prototype.validate = function (data, callback) {
	var errors = null;
	data = utils.clone(data);
	for (var path in this.validators) {
		var err = validateAtPath(path, this.validators[path], data);
		if (err) {
			errors = errors || { missing: [], invalid: [] };
			if (err.missing) errors.missing.push(path);
			if (err.invalid) errors.invalid.push(path);
		}
	}
	callback(errors, data);
};

function validateDefinition (definition) {
	if (!utils.isObject(definition) || utils.isEmpty(definition)) {
		throw new Error(util.format('Invalid schema definition: %s', definition));
	}
}

function validateElement (element) {
	var value = utils.isArray(element) ? element[0] : element;
	if (!utils.isObject(value)) {
		throw new Error(util.format('Expected object but got %s for element in schema definition', value));
	}
	return value;
}

function createValidators (target, validators, prefix) {
	prefix = prefix ? (prefix + '.') : '';
	validators = validators || {};
	for (var key in target) {
		if (target.hasOwnProperty(key)) {
			var val = target[key];
			var value = validateElement(val);
			if (value.hasOwnProperty('$type')) {
				validators[prefix + key] = new Validator(val);
			} else {
				createValidators(value, validators, prefix + key);
			}
		}
	}
	return validators;
};

function validateAtPath (path, validator, data) {
	var tokens = path.split('.');
	var value = data;
	var key;
	var error;

	for (var i = 0, len = tokens.length; i < len; i += 1) {
		key = tokens[i];
		if (i === len - 1) {
			validator.validate(value[key], function (err, res) {
				if (err) {
					error = err;
					return;
				}
				value[key] = res;
			});
		} else if (!utils.isValue(value[key])) {
			value[key] = {};
		}

		if (error) return error;
		
		value = value[key];
	}
}

module.exports = exports = Schema;