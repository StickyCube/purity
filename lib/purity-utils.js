"use strict";

var _ 		= require('underscore');

module.exports = {

	isValue: function (v) {
		return v !== null && v !== undefined;
	},

	isString: function (v) {
		return this.isValue(v) && v.constructor === String;
	},

	isUndefined: function (v) {
		return v === undefined;
	},

	isArray: function (v) {
		return this.isValue(v) && v.constructor === Array;
	},

	isNumber: function (v) {
		return this.isValue(v) && v.constructor === Number;
	},

	isObject: function (v) {
		return this.isValue(v) && v.constructor === Object;
	},

	isEmpty: function (v) {
		if (this.isObject(v)) return Object.keys(v).length === 0;
		if (this.isString(v)) return v === '';
	},

	isFunction: function (v) {
		return this.isValue(v) && v.constructor === Function;
	},

	isSchema: function (v) {
		return this.isValue && v.constructor === require('./schema');
	},

	isEnumerable: function (v) {
		return this.isObject(v) || this.isArray(v);
	},

	unique: function (v) {
		return _.uniq(v);
	},

	clone: function (v) {
		if (this.isEnumerable(v)) {
			var data = new v.constructor;
			_.each(v, function (val, key) {
				data[key] = this.clone(val);
			}, this);
			return data;
		}
		return _.clone(v);
	}
};