"use strict";

var isNumber = require('./utils').isNumber;

/**
 * Element
 */

function Element (def, path) {
	if (!(this instanceof Element)) return new Element(def, path);
	_init.call(this, def, path);
}

Element.prototype.constructor = Element;

Element.prototype.$$error;

Element.prototype.$type;

Element.prototype.$cast;

Element.prototype.$required;

Element.prototype.$default;

Element.prototype.$castTo;

Element.prototype.$mutator;

Element.prototype.validate = function (data, callback) {
	callback(null, data);
};

/**
 * StringElement
 */
function StringElement (def, path) {
	_init.call(this, def, path);

	this.$regex 			= def.$regex;
	this.$minlength 	= def.$minlength;
	this.$maxlength 	= def.$maxlength;
	this.$fixedwidth 	= def.$fixedwidth;
	this.$tolower 		= Boolean(def.$tolower);
	this.$toupper 		= Boolean(def.$toupper);

	if ((this.$minlength || 0) < 1) 	this.$minlength = -1;
	if ((this.$maxlength || 0) < 1) 	this.$maxlength = Infinity;
	if ((this.$fixedwidth || 0) < 1) 	this.$fixedwidth = 0;
}

StringElement.prototype.constructor = StringElement;

StringElement.prototype.$$error;

StringElement.prototype.$type;

StringElement.prototype.$cast;

StringElement.prototype.$required;

StringElement.prototype.$default;

StringElement.prototype.$castTo;

StringElement.prototype.$mutator;

StringElement.prototype.$regex;

StringElement.prototype.$minlength;

StringElement.prototype.$maxlength;

StringElement.prototype.$fixedwidth;

StringElement.prototype.$tolower;

StringElement.prototype.$toupper;

StringElement.prototype.validate = function (data, callback) {
	if (data.length < this.$minlength) {
	 	return callback(this.$$error, data);
	}
	
	if (data.length > this.$maxlength) {
		return callback(this.$$error, data);
	}

	if (this.$fixedwidth && this.$fixedwidth !== data.length) {
		return callback(this.$$error, data);
	}

	if (this.$tolower) { 
		data = data.toLowerCase();
	}

	if (this.$toupper) {
		data = data.toUpperCase();
	}

	if (this.$regex && !this.$regex.test(data)) {
		return callback(this.$$error, data);
	}

	callback(null, data);
}

/**
 * NumberElement
 */

function NumberElement (def, path) {
	_init.call(this, def, path);

	this.$gt 			= def.$gt;
	this.$gte 		= def.$gte;
	this.$lt 			= def.$lt;
	this.$lte 		= def.$lte;
	this.$mod 		= def.$mod;
	this.$tofixed = def.$tofixed
	this.$integer = Boolean(def.$integer);
	this.$abs 		= Boolean(def.$abs);
	this.$neg 		= Boolean(def.$neg); 

	if (!isNumber(this.$gt)) this.$gt = -Infinity;
	if (!isNumber(this.$gte)) this.$gte = -Infinity;
	if (!isNumber(this.$lt)) this.$lt = Infinity;
	if (!isNumber(this.$lte)) this.$lte = Infinity;
	if (!isNumber(this.$mod) || this.$mod < 1) this.$mod = Infinity;
	if (!isNumber(this.$tofixed) || this.$tofixed < 0 || this.$tofixed > 20) this.$tofixed = 0;
}

NumberElement.prototype.constructor = NumberElement;

NumberElement.prototype.$$error;

NumberElement.prototype.$type;

NumberElement.prototype.$cast;

NumberElement.prototype.$required;

NumberElement.prototype.$default;

NumberElement.prototype.$castTo;

NumberElement.prototype.$mutator;

NumberElement.prototype.$gt;

NumberElement.prototype.$gte;

NumberElement.prototype.$lt;

NumberElement.prototype.$lte;

NumberElement.prototype.$mod;

NumberElement.prototype.$tofixed;

NumberElement.prototype.$integer;

NumberElement.prototype.$abs;

NumberElement.prototype.$neg;


NumberElement.prototype.validate = function (data, callback) {

	if (this.$integer) {
		data = parseInt(data);
	}

	if (this.$tofixed) {
		data = +data.toFixed(this.$tofixed);
	}

	if (this.$abs) {
		data = Math.abs(data);
	}

	if (this.$neg) {
		data = (- Math.abs(data));
	}

	data %= this.$mod;

	if (data <= this.$gt) {
		return callback(this.$$error, data);
	}

	if (data < this.$gte) {
		return callback(this.$$error, data);
	}

	if (data >= this.$lt) {
		return callback(this.$$error, data);
	}

	if (data > this.$lte) {
		return callback(this.$$error, data);
	}

	callback(null, data);
}

module.exports.Element = Element;
module.exports.StringElement = StringElement;
module.exports.NumberElement = NumberElement;


function _init (def, path) {
	this.$$error = { invalid: [path] };

	this.$required = Boolean(def.$required);
	this.$type = def.$type;
	this.$cast = def.$cast;
	this.$default = def.$default;

	if (def.$castTo) {
		this.$castTo = def.$castTo;
	}

	if (def.$mutator) {
		this.$mutator = def.$mutator;
	}
}