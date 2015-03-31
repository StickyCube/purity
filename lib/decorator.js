"use strict";

var utils = require('./purity-utils');

var makeStringType 	= require('./types/validate-string');
var makeNumberType 	= require('./types/validate-number');
var makeBooleanType = require('./types/validate-boolean');

module.exports = function (validator) {
	initShared(validator.element);
	if (validator.expectsArray) {
		initArray(validator.element);
	}
	if (validator.baseType === String) 	makeStringType(validator);
	if (validator.baseType === Number) 	makeNumberType(validator);
	if (validator.baseType === Boolean) makeBooleanType(validator);
};

function initShared (element) {
	element.$cast = Boolean(element.$cast);
	element.$required = Boolean(element.$required);
}

function initArray (element) {
	element.$purge = Boolean(element.$purge);
	element.$unique = Boolean(element.$unique);
	if (utils.isValue(element.$sort)) {
		if (utils.isString(element.$sort)) {
			element.$sort = {
				asc: function (a, b) { return a > b; },
				desc: function (a, b) { return a < b; }
			}[element.$sort];
		} else if (!utils.isFunction(element.$sort)) element.$sort = undefined
	}
}