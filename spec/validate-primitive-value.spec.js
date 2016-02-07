'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Basic value schema', function () {
  var schema = null;

  describe('When not using the $type syntax', function () {
    beforeEach(function () {
      schema = purity.Schema(Number);
    });

    it('Should validate a number correctly', function (done) {
      schema.validate(123, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql(123);
        done();
      });
    });

    it('Should reject a string', function (done) {
      schema.validate('abc', function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });

  describe('When using the $type syntax', function () {
    beforeEach(function () {
      schema = purity.Schema({ $type: Number });
    });

    it('Should validate a number correctly', function (done) {
      schema.validate(123, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql(123);
        done();
      });
    });

    it('Should reject a string', function (done) {
      schema.validate('abc', function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });

  describe('When using an existing Schema', function () {
    var reference = null;

    before(function () {
      reference = purity.Schema({ $type: Number });
    });

    beforeEach(function () {
      schema = purity.Schema(reference);
    });

    it('Should validate a number correctly', function (done) {
      schema.validate(123, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql(123);
        done();
      });
    });

    it('Should reject a string', function (done) {
      schema.validate('abc', function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });
});
