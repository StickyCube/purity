"use strict";

var pick = require('./utils').pick;

var SORT_ASC = function (a, b) { return a > b; };
var SORT_DESC = function (a, b) { return a < b; };
var SortFn = {
	asc: SORT_ASC,
	desc: SORT_DESC
};

module.exports.defaults = function (options) {
	return {
		prefix: options.prefix || ''
	};
};

module.exports.arrayDefaults = function (def) {
	var opt = def[1] || pick(def[0], ['$purge', '$unique', '$sort']);

	opt.expectsArray = true;

	if (isString(opt.$sort)) {
		opt.$sort = SortFn[opt.$sort] || null;
	}

	return opt;
};

function isString (v) {
	return typeof v === 'string';
}