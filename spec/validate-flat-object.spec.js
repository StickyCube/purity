'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Basic flat object Schema', function () {
  var schema = null;

  describe('When not using $type syntax', function () {
    beforeEach(function () {
      schema = purity.Schema({
        foo: Number,
        bar: String
      });
    });

    it('Should resolve a valid object', function (done) {
      schema.validate({ foo: 123, bar: 'abc' }, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ foo: 123, bar: 'abc' });
        done();
      });
    });

    it('Should reject when at least one value is invalid', function (done) {
      schema.validate({ foo: 123, bar: 456 }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });

  describe('When using $type syntax', function () {
    beforeEach(function () {
      schema = purity.Schema({
        foo: { $type: Number },
        bar: { $type: String }
      });
    });

    it('Should resolve a valid object', function (done) {
      schema.validate({ foo: 123, bar: 'abc' }, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ foo: 123, bar: 'abc' });
        done();
      });
    });

    it('Should reject when at least one value is invalid', function (done) {
      schema.validate({ foo: 123, bar: 456 }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });

  describe('When using existing schemas', function () {
    beforeEach(function () {
      var numberSchema = purity.Schema(Number);
      var stringSchema = purity.Schema(String);

      schema = purity.Schema({
        foo: numberSchema,
        bar: stringSchema
      });
    });

    it('Should resolve a valid object', function (done) {
      schema.validate({ foo: 123, bar: 'abc' }, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ foo: 123, bar: 'abc' });
        done();
      });
    });

    it('Should reject when at least one value is invalid', function (done) {
      schema.validate({ foo: 123, bar: 456 }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });
});
