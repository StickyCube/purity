"use strict";

var expect = require('chai').expect;
var Schema = require('../index').Schema;

describe('Schema', function () {
	var error, result;

	before(function () {
		error = result = undefined;
	});

	describe('basic arrays', function () {

		var basicNumberArraySchama = new Schema({
			data: [{ $type: Number }]
		});

		var basicStringArraySchema = new Schema({
			data: [{ $type: String }]
		});

		it('should validate an array of numbers', function () {
			basicNumberArraySchama.validate({ data: [1, 2, 3] }, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result.data).to.have.length(3);
			expect(result.data).to.have.members([1, 2, 3]);
		});

		it('should not validate an invalid array', function () {
			basicNumberArraySchama.validate({ data: [1, 2, '3'] }, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.a('object');
			expect(error.missing).to.have.length(0);
			expect(error.invalid).to.have.length(1);
			expect(error.invalid).to.have.members(['data']);
			expect(result).to.be.a('object');
			expect(result.data).to.have.length(3);
			expect(result.data).to.have.members([1, 2, '3'])
		});
	});

	describe('purge option', function () {

		var basicNumberArraySchama = new Schema({
			data: [{ $type: Number, $purge: true }]
		});

		it('should leave a valid array unchanged', function () {
			var data = {
				data: [1, 2, 3]
			};

			basicNumberArraySchama.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result).to.be.a('object');
			expect(result.data).to.have.length(3);
			expect(result.data).to.have.members([1, 2, 3]);
		});

		it('should remove invalid elements', function () {
			var data = { data: [1, 2, '3'] };
			basicNumberArraySchama.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result).to.be.a('object');
			expect(result.data).to.have.length(2);
			expect(result.data).to.have.members([1, 2]);
		});

		it('should remove all elements if they are invalid', function () {
			var data = { data: ['1', '2', '3'] };
			basicNumberArraySchama.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result).to.be.a('object');
			expect(result.data).to.have.length(0);
		});
	});

	describe('sort option', function () {

		var sortFn = function (a, b) {
			return a.length < b.length ? -1 : 1;
		};

		var noSortSchema = new Schema({ data: [{ $type: String, $sort: 'foo' }] });
		var sortAscSchema = new Schema({ data: [{ $type: String, $sort: 'asc' }] });
		var sortDescSchema = new Schema({ data: [{ $type: String, $sort: 'desc' }] });
		var sortFnSchema = new Schema({ data: [{ $type: String, $sort: sortFn }] });

		// var data, customData;

		// before(function() {
		// 	data = { data: [ 'ee', 'b', 'aaa', 'ccccc', 'dddd' ] };
		// 	customData = { data: ['a', ] }
		// });

		it('should sort data ascending', function () {
			var data = { data: [ 'ee', 'b', 'aaa', 'ccccc', 'dddd' ] };

			sortAscSchema.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result.data).to.have.length(5);
			expect(result.data[0]).to.equal('aaa');
			expect(result.data[1]).to.equal('b');
			expect(result.data[2]).to.equal('ccccc');
			expect(result.data[3]).to.equal('dddd');
			expect(result.data[4]).to.equal('ee');
		});

		it('should sort data descending', function () {
			error = result = undefined;
			var data = { data: [ 'ee', 'b', 'aaa', 'ccccc', 'dddd' ] };
			sortDescSchema.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result.data).to.have.length(5);
			expect(result.data[4]).to.equal('aaa');
			expect(result.data[3]).to.equal('b');
			expect(result.data[2]).to.equal('ccccc');
			expect(result.data[1]).to.equal('dddd');
			expect(result.data[0]).to.equal('ee');
		});

		it('should sort data by length', function () {
			var data = { data: [ 'ee', 'b', 'aaa', 'ccccc', 'dddd' ] };
			sortFnSchema.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result.data).to.have.length(5);
			expect(result.data[0]).to.equal('b');
			expect(result.data[1]).to.equal('ee');
			expect(result.data[2]).to.equal('aaa');
			expect(result.data[3]).to.equal('dddd');
			expect(result.data[4]).to.equal('ccccc');
		});

		it('should not sort data', function () {
			var data = { data: [ 'ee', 'b', 'aaa', 'ccccc', 'dddd' ] };

			noSortSchema.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result.data).to.have.length(5);
			expect(result.data[0]).to.equal('ee');
			expect(result.data[1]).to.equal('b');
			expect(result.data[2]).to.equal('aaa');
			expect(result.data[3]).to.equal('ccccc');
			expect(result.data[4]).to.equal('dddd');
		});
	});

	describe('unique option', function () {
		var uniqueSchema = new Schema({
			data: [ { $type: String, $unique: true } ]
		});

		it('should leave a unique array unchanged', function () {
			var data = { data: ['a', 'b', 'c', 'd', 'e'] };
			uniqueSchema.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result).to.be.a('object');
			expect(result.data).to.have.length(5);
			expect(result.data).to.have.all.members(['a', 'b', 'c', 'd', 'e']);
		});

		it('should remove duplicates of values in an array', function () {
			var data = { data: ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd'] };
			uniqueSchema.validate(data, function (err, res) {
				error = err;
				result = res;
			});
			expect(error).to.be.null;
			expect(result).to.be.a('object');
			expect(result.data).to.have.length(5);
			expect(result.data).to.have.all.members(['a', 'b', 'c', 'd', 'e']);
		});

	});
});