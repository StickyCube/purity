"use strict";

var utils = {
	isValue: function (v) {
		return v !== null && v !== undefined && v !== NaN;
	},

	isDefined: function (v) {
		return v !== undefined;
	},

	isArray: function (v) {
		return v instanceof Array;
	},

	isObject: function (v) {
		return utils.isValue(v) && v.constructor === Object;
	},

	isFunction: function (v) {
		return utils.isValue(v) && v.constructor === Function;
	},

	isNumber: function (v) {
		return utils.isValue(v) && v.constructor === Number;
	},

	isEnumerable: function (v) {
		return utils.isObject(v) || utils.isArray(v);
	},

	clone: function (v) {
		if (utils.isEnumerable(v)) {
			var data = new v.constructor;
			each(v, function (val, key) {
				data[key] = utils.clone(val);
			});
			return data;

		} else if (utils.isFunction(v)) {
			return v;
		}

		return cloneShallow(v);
	},

	union: function (a, b) {
		a = a || [];
		b = b || [];
		var c = utils.clone(a);
		each(b, function (val) {
			if (c.indexOf(val) == -1) {
				c.push(val);
			}
		});
		return c;
	},

	filter: function (data, whitelist) {
		var keys = Object.keys(data);
		for (var i = 0, len = keys.length; i < len; i += 1) {
			if (whitelist.indexOf(keys[i]) < 0) {
				delete data[keys[i]];
			}
		}
		return data;
	}
};

function each (obj, it) {
	for (var i in obj) {
		it(obj[i], i);
	}
};

function cloneShallow (obj) {
	if (!utils.isEnumerable(obj)) {
		return obj;
	}
	var v = new obj.constructor;
	each(obj, function (val, key) {
		v[key] = val;
	});
	return v;
};

module.exports = utils;