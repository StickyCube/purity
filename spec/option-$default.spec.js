'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('$default option', function () {
  var schema = null;

  describe('With no default option', function () {
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

  describe('When $default is a static value', function () {
    before(function () {
      schema = purity.Schema({ $type: Number, $default: 123 });
    });

    it('Should resolve with the given value', function (done) {
      return schema.validate(null, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql(123);
        done();
      });
    });
  });

  describe('When $default is a function', function () {
    before(function () {
      var fn = function () { return 12345; };
      schema = purity.Schema({ $type: Number, $default: fn });
    });

    it('Should resolve with the function return value', function (done) {
      return schema.validate(null, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql(12345);
        done();
      });
    });
  });
});
