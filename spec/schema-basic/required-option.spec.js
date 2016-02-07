'use strict';

var expect = require('chai').expect;
var purity = require('../../src/purity');

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
});
