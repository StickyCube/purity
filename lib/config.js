
var options = require('./options');
var isObject = require('./utils').isObject;

module.exports = function (opts) {

	if (!isObject(opts)) {
		return false;
	}

	for (var i in opts) {
		if (opts.hasOwnProperty(i)) {
			options.set(i, opts[i]);
		}
	}
};