"use strict";

var elements 			= require('./element');
var utils 				= require('./utils');

var isValue 			= utils.isValue;
var isDefined 		= utils.isDefined;
var isArray 			= utils.isArray;
var isObject 			= utils.isObject;
var isFunction 		= utils.isFunction;
var isEnumerable 	= utils.isEnumerable;
var clone 				= utils.clone;

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
	this.path = path;

	switch (element.$type.name) {
		case 'String': this.element = new elements.StringElement(element, path); break;
		case 'Number': this.element = new elements.NumberElement(element, path); break;
		default: this.element = new elements.Element(element, path); break;
	}
}

/**
 * Validator Constructor
 */
Validator.prototype.constructor = Validator;


/**
 * Validator element schema
 */
Validator.prototype.element;


/**
 * Validator path
 */
Validator.prototype.path;


/**
 * Validate the given data according to the Validator's element schema
 * @param  {Any}   		data     		Data to validate
 * @param  {Function} callback 
 */
Validator.prototype.validate = function (data, callback) {
	var error = null
		, result = data;

	if (isValue(data)) {

		// if a value is present, check the type is correct		
		if (data.constructor !== this.element.$type) {

			if (this.element.$cast) {
				result = castToType(data, this.element.$type);
			}

			if (!this.element.$cast || !isValue(result)) {
				return callback({ invalid: [this.path] }, data)	
			}

		}

		// cast now if we need to
		if (this.element.$castTo) {
			result = castToType(data, this.element.$castTo);
			if (!isValue(result)) {
				callback({ invalid: [this.path] }, data);
			} else {
				callback(null, result);
			}
			return;
		}

		// check for a custom mutator
		if (this.element.$mutator) {
			result = this.element.$mutator(result);
		}

		this.element.validate(result, callback);
		return;
	}

	if (isDefined(this.element.$default)) {
		result = getDefaultValue(this.element.$default);
	} else if (this.element.$required) {
		error = { missing: [this.path] };
	}

	callback(error, result);
};

module.exports = exports = Validator;

function castToType (v, ctor) {
	var data = v;
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

function getDefaultValue (v) {
	if (isFunction(v)) {
		return v();
	}
	return clone(v);
}