"use strict";

var expect 	= require('chai').expect;
var Schema 	= require('../index').Schema;

var ValidElement = { $type: String };

describe('Schema', function () {
	describe('#validators', function () {
		it('Should compile top level paths - 1', function () {
			var schema = new Schema({
				foo: ValidElement,
				bar: ValidElement,
				baz: ValidElement
			});
			var keys = Object.getOwnPropertyNames(schema.validators);

			expect(keys).to.have.length(3);
			expect(keys).to.have.all.members(['foo', 'bar', 'baz']);
		});

		it('should compile deeper nested paths', function () {
			var schema = new Schema({
				foo: {
					bar: ValidElement,
					baz: {
						hello: ValidElement
					}
				}
			});
			var keys = Object.getOwnPropertyNames(schema.validators);
			expect(keys).to.have.length(2);
			expect(keys).to.have.all.members(['foo.bar', 'foo.baz.hello']);
		});

		it('should compile more deep-lier nested paths', function () {
			var schema = new Schema({
				foo: {
					bar: ValidElement,
					baz: {
						hello: ValidElement,
						fizz: ValidElement,
						buzz: {
							bang: ValidElement
						}
					}
				}
			});
			var keys = Object.getOwnPropertyNames(schema.validators);
			expect(keys).to.have.length(4);
			expect(keys).to.have.all.members(['foo.bar', 'foo.baz.hello', 'foo.baz.fizz', 'foo.baz.buzz.bang']);
		});
	});
});