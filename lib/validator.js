"use strict";

var utils 		= require('./purity-utils');
var decorate 	= require('./decorator');

function Validator (element) {
	this.expectsArray = utils.isArray(element);
	this.element 			= this.expectsArray ? element[0] : element;
	this.baseType 		= this.element.$type;
	decorate(this);
}

Validator.prototype = {
	constructor: Validator,

	validate: function (data, callback) {
		if (!utils.isValue(data)) {
			if (this.element.$required) {
				return callback({ missing: true }, null);
			}
			if (!utils.isUndefined(this.element.$default)) {
				var result;
				if (utils.isFunction(this.element.$default)) {
					result = this.element.$default();
				} else {
					result = utils.clone(this.element.$default);
				}
				return callback(null, result);
			}
			return callback(null, data);
		}
		if (this.expectsArray)	return this.validateArray(data, callback);
		if (this.baseType) 			return this.validateType(data, callback);
	},

	validateArray: function (data, callback) {
		if (!utils.isArray(data)) return callback({ invalid: true }, null);
		if (data.length === 0)		return callback(null, data);
		
		var error = null
			, result = []
			, i = 0
			, self = this;

		while (i < data.length && !error) {
			this.validateType(data[i], function (err, res) {
				if (err) {
					if (!self.element.$purge) error = err;
				}
				else result.push(res);
				i += 1;
			});
		}

		if (error) {
			return callback(error, null);
		}

		if (this.element.$unique) {
			result = utils.unique(result);
		}

		if (utils.isFunction(this.element.$sort)) {
			result.sort(this.element.$sort);
		}

		callback(null, result);
	}
};

module.exports = Validator;