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
});
