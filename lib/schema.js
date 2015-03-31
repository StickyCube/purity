"use strict";

var util 		= require('util');

var utils 		= require('./purity-utils')
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
		validateAtPath(path, this.validators[path], data, function (err) {
			if (err) {
				errors = errors || { missing: [], invalid: [] };
				if (err.missing) errors.missing = errors.missing.concat(err.missing);
				if (err.invalid) errors.invalid = errors.invalid.concat(err.invalid);
			}
		});
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
	if (!utils.isObject(value) && !utils.isSchema(value)) {
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

			if (utils.isSchema(value)) {
				validators[prefix + key] = value;
			} else if (value.hasOwnProperty('$type')) {
				validators[prefix + key] = new Validator(val);
			} else {
				createValidators(value, validators, prefix + key);
			}
		}
	}
	return validators;
};

function validateAtPath (path, validator, data, callback) {
	var tokens = path.split('.');
	var value = data;
	var key;
	var error;

	function errorMap (el) {
		return path + '.' + el;
	}

	for (var i = 0, len = tokens.length; i < len; i += 1) {
		key = tokens[i];
		if (i === len - 1) {
			validator.validate(value[key], function (err, res) {
				if (err) {
					error = { missing: [], invalid: [] };
					if (utils.isSchema(validator)) {
						error.missing = (err.missing || []).map(errorMap);
						error.invalid = (err.invalid || []).map(errorMap);
					} else {
						err.missing && error.missing.push(path);
						err.invalid && error.invalid.push(path);
					}
					return;
				}
				value[key] = res;
			});
		} else if (!utils.isValue(value[key])) {
			value[key] = {};
		}

		if (error) return callback(error);
		
		value = value[key];
	}

	callback(null);
}

module.exports = exports = Schema;