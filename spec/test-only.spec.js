'use strict';

var purity = require('../src/purity');
var expect = require('chai').expect;

describe('Schema#test', function () {
  var schema = null;

  describe('No assertions', function () {
    beforeEach(function () {
      schema = purity.Schema({
        data: { $type: Number }
      });
    });

    it('Should fail on testing a string', function (done) {
      schema.test({ data: 'abc' }, function (e, r) {
        expect(e).not.to.be.null;
        expect(r).not.to.be.defined;
        done();
      });
    });

    it('Should pass on testing a number', function (done) {
      schema.test({ data: 123 }, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ data: 123 });
        done();
      });
    });
  });

  describe('With assertions', function () {
    beforeEach(function () {
      schema = purity.Schema({
        data: { $type: Number, $lt: 10 }
      });

      it('Should fail on testing a number gt 10', function (done) {
        schema.test({ data: 15 }, function (e, r) {
          expect(e).not.to.be.null;
          expect(r).not.to.be.defined;
          done();
        });
      });

      it('Should pass on testing a number lt 10', function (done) {
        schema.test({ data: 5 }, function (e, r) {
          expect(e).to.be.null;
          expect(r).to.eql({ data: 5 });
          done();
        });
      });
    });
  });
});
