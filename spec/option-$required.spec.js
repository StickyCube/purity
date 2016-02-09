'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('$required option', function () {
  var schema = null;

  describe('With no $required option', function () {
    before(function () {
      schema = purity.Schema({ $type: Number });
    });

    it('Should resolve with null', function (done) {
      return schema.validate(null, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql(null);
        done();
      });
    });
  });

  describe('With $required = true option', function () {
    before(function () {
      schema = purity.Schema({ $type: Number, $required: true });
    });

    it('Should reject', function (done) {
      return schema.validate(null, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });

  describe('It should not set the property if it is not required in an object', function () {
    before(function () {
      schema = purity.Schema({
        foo: {
          bar: { $type: Number, $required: true },
          baz: { $type: String, $required: false }
        }
      });
    });

    it('Should not set the foo.baz property', function (done) {
      schema.validate({ foo: { bar: 123 } }, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ foo: { bar: 123 } });
        done();
      });
    });
  });

  describe('It should create the object foo but not set properties', function () {
    before(function () {
      schema = purity.Schema({
        foo: {
          bar: { $type: Number, $required: false },
          baz: { $type: String, $required: false }
        }
      });
    });

    it('Should set foo to an empty object', function (done) {
      schema.validate({}, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ foo: {} });
        done();
      });
    });
  });

  describe('With a falsy number', function () {
    before(function () {
      schema = purity.Schema({
        data: { $type: Number, $required: true }
      });
    });

    it('Should pass with 0', function (done) {
      schema.validate({ data: 0 }, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });
  });

  describe('With a falsy string', function () {
    before(function () {
      schema = purity.Schema({
        data: { $type: String, $required: true }
      });
    });

    it('Should fail with an empty string', function (done) {
      schema.validate({ data: '' }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });

  describe('With a falsy bool', function () {
    before(function () {
      schema = purity.Schema({
        data: { $type: Boolean, $required: true }
      });
    });

    it('Should pass with false', function (done) {
      schema.validate({ data: false }, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });
  });
});
