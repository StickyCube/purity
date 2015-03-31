"use strict";

var expect = require('chai').expect;
var Schema = require('../index').Schema;

describe('Schema', function () {
	describe('basic arrays', function () {

		var basicNumberArraySchama = new Schema({
			data: [{ $type: Number }]
		});

		var basicStringArraySchema = new Schema({
			data: [{ $type: String }]
		});

		it('should validate an array of numbers', function () {
			basicNumberArraySchama.validate({ data: [1, 2, 3] }, function (err, res) {
				expect(err).to.be.null;
				expect(res.data).to.have.length(3);
				expect(res.data).to.have.members([1, 2, 3]);
			});
		});

		it('should not validate an invalid array', function () {
			basicNumberArraySchama.validate({ data: [1, 2, '3'] }, function (err, res) {
				expect(err).to.be.a('object');
				expect(err.missing).to.have.length(0);
				expect(err.invalid).to.have.length(1);
				expect(err.invalid).to.have.members(['data']);
				expect(res).to.be.a('object');
				expect(res.data).to.have.length(3);
				expect(res.data).to.have.members([1, 2, '3'])
			});
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
				expect(err).to.be.null;
				expect(res).to.be.a('object');
				expect(res.data).to.have.length(3);
				expect(res.data).to.have.members([1, 2, 3]);
			});
		});

		it('should remove invalid elements', function () {
			var data = { data: [1, 2, '3'] };
			basicNumberArraySchama.validate(data, function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.a('object');
				expect(res.data).to.have.length(2);
				expect(res.data).to.have.members([1, 2]);
			});
		});

		it('should remove all elements if they are invalid', function () {
			var data = { data: ['1', '2', '3'] };
			basicNumberArraySchama.validate(data, function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.a('object');
				expect(res.data).to.have.length(0);
			});
		});
	});

	describe('sort option', function () {

		var sortFn = function (a, b) {
			return a.length < b.length ? -1 : 1;
		};

		var noSortSchema = new Schema({ data: [{ $type: String, $sort: 'foo' }] });
		var sortAscSchema = new Schema({ data: [{ $type: String, $sort: 'asc' }] });
		var sortDescSchema = new Schema({ data: [{ $type: String, $sort: 'asc' }] });
		var sortFnSchema = new Schema({ data: [{ $type: String, $sort: sortFn }] });

		var data = { data: [ 'ee', 'b', 'aaa', 'ccccc', 'dddd' ] };
		var customData = { data: ['a', ] }

		it('should sort data ascending', function () {
			sortAscSchema.validate(data, function (err, res) {
				expect(err).to.be.null;
				expect(res.data).to.have.length(5);
				expect(res.data[0]).to.equal('aaa');
				expect(res.data[1]).to.equal('b');
				expect(res.data[2]).to.equal('ccccc');
				expect(res.data[3]).to.equal('dddd');
				expect(res.data[4]).to.equal('ee');
			});
		});

		it('should sort data descending', function () {
			sortDescSchema.validate(data, function (err, res) {
				expect(err).to.be.null;
				expect(res.data).to.have.length(5);
				expect(res.data[0]).to.equal('aaa');
				expect(res.data[1]).to.equal('b');
				expect(res.data[2]).to.equal('ccccc');
				expect(res.data[3]).to.equal('dddd');
				expect(res.data[4]).to.equal('ee');
			});
		});

		it('should sort data by length', function () {
			sortFnSchema.validate(data, function (err, res) {
				expect(err).to.be.null;
				expect(res.data).to.have.length(5);
				expect(res.data[0]).to.equal('b');
				expect(res.data[1]).to.equal('ee');
				expect(res.data[2]).to.equal('aaa');
				expect(res.data[3]).to.equal('dddd');
				expect(res.data[4]).to.equal('ccccc');
			});
		});

		it('should not sort data', function () {
			noSortSchema.validate(data, function (err, res) {
				expect(err).to.be.null;
				expect(res.data).to.have.length(5);
				expect(res.data[0]).to.equal('ee');
				expect(res.data[1]).to.equal('b');
				expect(res.data[2]).to.equal('aaa');
				expect(res.data[3]).to.equal('ccccc');
				expect(res.data[4]).to.equal('dddd');
			});
		});
	});

	describe('unique option', function () {
		var uniqueSchema = new Schema({
			data: [ { $type: String, $unique: true } ]
		});

		it('should leave a unique array unchanged', function () {
			var data = { data: ['a', 'b', 'c', 'd', 'e'] };
			uniqueSchema.validate(data, function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.a('object');
				expect(res.data).to.have.length(5);
				expect(res.data).to.have.all.members(['a', 'b', 'c', 'd', 'e']);
			});
		});

		it('should remove duplicates of values in an array', function () {
			var data = { data: ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd'] };
			uniqueSchema.validate(data, function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.a('object');
				expect(res.data).to.have.length(5);
				expect(res.data).to.have.all.members(['a', 'b', 'c', 'd', 'e']);
			});
		});

	});
});