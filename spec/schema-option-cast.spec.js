'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('schema level cast option', function () {
  var schema = null;

  describe('With no type-level options', function () {
    before(function () {
      schema = purity.Schema({ foo: Number, bar: String }, { cast: true });
    });

    it('Should validate and cast the data', function (done) {
      schema.validate({ foo: '123', bar: 456 }, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ foo: 123, bar: '456' });
        done();
      });
    });
  });

  describe('With type-level options', function () {
    before(function () {
      schema = purity.Schema({ foo: { $type: Number, $cast: false }, bar: String }, { cast: true });
    });

    it('Should fail to validate', function (done) {
      schema.validate({ foo: '123', bar: 456 }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });
});
