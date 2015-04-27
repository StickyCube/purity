"use strict";

var options 			= require('./options');
var Validator 		= require('./validator');

var utils 				= require('./utils');
var union 				= utils.union;
var isValue 			= utils.isValue;
var isDefined 		= utils.isDefined;
var isArray 			= utils.isArray;
var isObject 			= utils.isObject;
var isFunction 		= utils.isFunction;
var clone 				= utils.clone;


function Schema (def, o) {
	o = o || {};
	if (!isValue(def) || isEmpty(def)) {
		throw new Error('Invalid Schema definition - ' + def);
	}

	if (!isSchema(this)) return new Schema(def, o);

	this.def = def;
	this.validators = {};
	this.arrays = {};
	this.options = options.defaults(o);

	if (this.options.strict) {
		this.options.whitelist = Object.keys(def);
	}

	this.$compile();
}

Schema.prototype.constructor = Schema;

Schema.prototype.options;

Schema.prototype.def;

Schema.prototype.validators;

Schema.prototype.arrays;

Schema.prototype.validate = Schema.prototype.cleanse = function (data, callback) {
	var paths = Object.keys(this.validators)
		, prefix = this.options.prefix
		, e = null
		, path
		, validationFn
		, res = clone(data);

	for (var i = 0, len = paths.length; i < len; i += 1) {
		var error
			, result;

		path = paths[i];

		if (this.arrays[path]) {
			validationFn = validateArray;
		} else {
			validationFn = validateSimple;
		}

		validationFn.call(this, path, res, function (e, r) {
			error = e;
			result = r;
		});

		if (error) {
			e = mergeErrors(e, error, prefix);
		} else if (isDefined(result)) {
			this.$setDataAtPath(res, result, path);
		}
	}

	if (this.options.whitelist) {
		utils.filter(res, this.options.whitelist);
	}

	callback(e, res);
};

function validateSimple (path, data, callback) {
	var v = this.validators[path]
		, d = this.$getDataAtPath(data, path);
	v.validate(d, callback);
}

function validateArray (path, data, callback) {
	var err = null
		, res = []
		, v = this.validators[path]
		, d = this.$getDataAtPath(data, path)
		, opt = this.arrays[path];

	if (!isArray(d)) {
		return callback({ invalid: [path] }, d);
	}

	for (var i = 0, len = d.length; !err && i < len; i += 1) {
		var error, result;

		v.validate(d[i], function (e, r) {
			error = e;
			result = r;
		});


		if (error && !opt.$purge) {
			err = mergeErrors(err, error, this.options.prefix);
		} else if (!error) {
			if (!opt.$unique || res.indexOf(result) === -1) {
				res.push(result);
			}
		}
	}

	if (!err && opt.$sort) {
		res.sort(opt.$sort);
	}

	callback(err, err ? d : res);
}

Schema.prototype.$compile = function (v, pre) {
	
	if (!v) v = this.def;

	pre = pre || '';

	if (pre) { 
		pre += '.';
	}

	var keys = Object.keys(v)
		, key
		, prefix
		, field;

	for (var i = 0, len = keys.length; i < len; i += 1) {
		key = keys[i];
		field = v[key];
		prefix = pre + key;

		if (isArray(field)) {

			if (isSchema(field[0])) {
				field[0] = clone(field[0].def);
			}

			this.arrays[prefix] = options.arrayDefaults(field);
			
			var validator;

			if (isEndpoint(field[0])) {
				validator = new Validator(field[0], prefix);
			} else {
				validator = new Schema(field[0], { prefix: prefix })
			}

			this.validators[prefix] = validator;

		} else {
			if (isSchema(field)) {
				v[key] = field = clone(field.def);
			}
			if (isEndpoint(field)) {
				this.validators[prefix] = new Validator(field, prefix);
			} else {
				this.$compile(field, prefix);
			}
		}
	}
};

Schema.prototype.$setDataAtPath = function (data, value, path) {
	var tokens = path.split('.')
		, current = data || {}
		, token;

	for (var i = 0, len = tokens.length; i < len; i += 1) {
		token = tokens[i];
		if (i === (len - 1)) {
			current[token] = value;	
		} else {
			current[token] = current[token] || {};
			current = current[token];
		}
	}
};

Schema.prototype.$getDataAtPath = function (data, path) {
	var tokens = path.split('.')
		, p = ''
		, current = data
		, token;

	for (var i = 0, len = tokens.length; i < len; i += 1) {
		token = tokens[i];
		
		if (p.length) {
			p += '.';
		}
		
		p += token;

		if (!isValue(current[token]) && (i < len - 1)) {
			if (this.arrays[p]) {
				current[token] = [];
			} else {
				current[token] = {};
			}
		}

		current = current[token];

		if (isArray(current)) {
			break;
		}
	}

	return current;
};

function isEndpoint (v) {
	return isFunction(v) || isFunction(v.$type);
}

function isEmpty (v) {
	if (isObject(v)) {
		v = Object.keys(v);
	}

	if (isArray(v)) {
		return !v.length;
	}

	return isValue(v);
}

function isSchema (v) {
	return v instanceof Schema;
}

function mergeErrors (e1, e2, prefix) {
	e1 = e1 || {};
	e2 = e2 || {};

	var err = {
		invalid: union(e1.invalid, e2.invalid),
		missing: union(e1.missing, e2.missing)
	};


	if (prefix) {
		var mapFn = function (e) {
			return prefix + '.' + e;
		};
		err.missing = err.missing.map(mapFn);
		err.invalid = err.invalid.map(mapFn);
	}

	return err;
}

module.exports = exports = Schema;