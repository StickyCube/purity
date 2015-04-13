"use strict";

var _ = require('underscore');

var DEFAULT_PREFIX = '';

var sortFunctions = { 
	asc: function (a, b) { 
		return a > b;
	}, 
	desc: function (a, b) { 
		return a < b;
	}
}

module.exports.defaults = function (options) {
	return {
		prefix: options.prefix || DEFAULT_PREFIX 
	};
};

module.exports.arrayDefaults = function (def) {
	var opt = def[1] || _.pick(def[0], ['$purge', '$unique', '$sort']);

	opt.expectsArray = true;
	
	if (typeof opt.$sort === 'string') {
		opt.$sort = sortFunctions[opt.$sort] || null;
	}

	return opt;
};