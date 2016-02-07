'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Using Schemas with a custom type', function () {
  before(function () {
    purity.createDataType({ aliases: ['Alias_2'] });
  });

  describe('Creating a schema', function () {
    it('Should create the schema without throwing', function () {
      expect(function () {
        return purity.Schema({ $type: 'Alias_2' });
      }).not.to.throw();
    });
  });

  describe('Validating', function () {
    var schema = null;

    before(function () {
      schema = purity.Schema({ $type: 'Alias_2' });
    });

    it('Should reject an array', function (done) {
      schema.validate([], function (err, res) {
        expect(err).not.to.be.null;
        done();
      });
    });

    it('Should resolve a string', function (done) {
      schema.validate('abc', function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });

    it('Should resolve a number', function (done) {
      schema.validate(123, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });

    it('Should resolve a bool', function (done) {
      schema.validate(false, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });

    it('Should resolve a object', function (done) {
      schema.validate({}, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });

    it('Should resolve a null', function (done) {
      schema.validate(null, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });

    it('Should resolve a undefined', function (done) {
      schema.validate(undefined, function (e, r) {
        expect(e).to.be.null;
        done();
      });
    });
  });
});
