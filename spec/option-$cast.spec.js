'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('$cast option', function () {
  var schema = null;

  describe('With no $cast option', function () {
    before(function () {
      schema = purity.Schema({ $type: Number });
    });

    it('Should fail to validate a string of digits', function (done) {
      schema.validate('1234', function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should validate a number', function (done) {
      schema.validate(1234, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });
  });

  describe('With $cast option', function () {
    before(function () {
      schema = purity.Schema({ $type: Number, $cast: true });
    });

    it('Should validate a string of numeric characters', function (done) {
      schema.validate('1234', function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql(1234);
        done();
      });
    });

    it('Should validate a number', function (done) {
      schema.validate(1234, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });

    it('Should fail to validate a string of non-numeric characters', function (done) {
      schema.validate('rgrgwrg', function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });
});
