"use strict";

var _ 					= require('underscore');
var options 		= require('./options');
var Validator 	= require('./validator');

function Schema (def, o) {
	o = o || {};
	if (!isSchema(this)) return new Schema(def, o);

	if (!isValue(def) || isEmpty(def)) {
		throw new Error('Invalid Schema definition - ' + def);
	}

	this.def = def;
	this.validators = {};
	this.arrays = {};
	this.options = options.defaults(o);

	this.$compile();
}

Schema.prototype.constructor = Schema;

Schema.prototype.options;

Schema.prototype.def;

Schema.prototype.validators;

Schema.prototype.arrays;

Schema.prototype.validate = function (data, callback) {
	var paths = Object.keys(this.validators)
		, prefix = this.options.prefix
		, e = null
		, path
		, validationFn;

	for (var i = 0, len = paths.length; i < len; i += 1) {
		var error
			, result;

		path = paths[i];

		if (this.arrays[path]) {
			validationFn = validateArray;
		} else {
			validationFn = validateSimple;
		}

		validationFn.call(this, path, data, function (e, r) {
			error = e;
			result = r;
		});

		if (error) {
			e = mergeErrors(e, error, prefix);
		} else {
			this.$setDataAtPath(data, result, path);
		}
	}

	callback(e, data);
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
			err = error;
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

	if (pre) { 
		pre += '.';
	} else {
		pre = this.options.prefix;
	}

	var keys = Object.keys(v)
		, key
		, prefix
		, field;

	for (var i = 0, len = keys.length; i < len; i += 1) {
		key = keys[i];
		field = v[key];
		prefix = pre + key;

		if (isSchema(field)) {
			v[key] = field = clone(field.def);
		}

		if (isArray(field)) {

			this.arrays[prefix] = options.arrayDefaults(field);
			
			var validator;

			if (isEndpoint(field[0])) {
				validator = new Validator(field[0], prefix);
			} else {
				validator = new Schema(field[0], { prefix: prefix })
			}

			this.validators[prefix] = validator;

		} else {
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
	return isPrimitive(v) || isPrimitive(v.$type);
}

function isValue (v) {
	return v !== undefined && v !== null;
}

function isEmpty (v) {
	if (isObject(v)) {
		v = Object.keys(v);
	}

	if (isString(v) || isArray(v)) {
		return !v.length;
	}

	return isValue(v);
}

function isString (v) {
	return typeof v === 'string';
}

function isArray (v) {
	return isValue(v) && v.constructor === Array;
}

function isObject (v) {
	return isValue(v) && v.constructor === Object;
}

function isFunction (v) {
	return typeof v === 'function';
}

function isPrimitive (v) {
	return v === String || v === Number || v === Boolean;
}

function isSchema (v) {
	return v instanceof Schema;
}

function mergeErrors (e1, e2, prefix) {
	if (!isValue(e1) && !isValue(e2)) {
		return null;
	}

	e1 = e1 || {};
	e2 = e2 || {};

	var err = {
		invalid: _.union(e1.invalid || [], e2.invalid || []),
		missing: _.union(e1.missing || [], e2.missing || [])
	};


	if (prefix) {
		var mapFn = function (e) {
			return prefix + '.' + e;
		};
		err.missing.map(mapFn);
		err.invalid.map(mapFn);
	}

	return err;
}

module.exports = exports = Schema;