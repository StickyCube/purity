"use strict";


var pick = require('./utils').pick;
var clone = require('./utils').clone;

var SORT_ASC = function (a, b) { return a > b; };
var SORT_DESC = function (a, b) { return a < b; };
var SortFn = {
	asc: SORT_ASC,
	desc: SORT_DESC
};

var DEFAULTS = {
	prefix: '',
	strict: false
};

module.exports.defaults = function (options) {
	return merge(DEFAULTS, options || {});
};

module.exports.arrayDefaults = function (def) {
	var opt = def[1] || pick(def[0], ['$purge', '$unique', '$sort']);

	opt.expectsArray = true;

	if (isString(opt.$sort)) {
		opt.$sort = SortFn[opt.$sort] || null;
	}

	return opt;
};

module.exports.set = function (key, value) {
	DEFAULTS[key] = value;
};

function isString (v) {
	return typeof v === 'string';
}

function merge (a, b) {
	var tmp = clone(a);

	for (var key in b) {
		if (b.hasOwnProperty(key)) {
			tmp[key] = clone(b[key]);
		}
	}

	return tmp;
}