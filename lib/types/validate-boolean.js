"use strict";

module.exports = function (validator) {
	validator.validateType = validate.bind(validator);
};

function validate (data, callback) {
	if (data.constructor !== Boolean) {
		if (this.element.$cast) {
			data = parseFloat(data);
		}

		if (!this.element.$cast || data === NaN) {
			return callback({ invalid: true }, null);
		}
	}
	callback(null, data);
}