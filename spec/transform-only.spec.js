'use strict';

var purity = require('../src/purity');
var expect = require('chai').expect;

describe('Schema#transform', function () {
  var schema = null;

  describe('No transforms', function () {
    beforeEach(function () {
      schema = purity.Schema({
        data: { $type: Number }
      });
    });

    it('Should still perform basic type check', function (done) {
      schema.transform({ data: 'abc' }, function (e, r) {
        expect(e).not.to.be.null;
        expect(r).not.to.be.defined;
        done();
      });
    });

    it('Should perform identity transformation', function (done) {
      schema.transform({ data: 2 }, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ data: 2 });
        done();
      });
    });
  });

  describe('No assertions', function () {
    beforeEach(function () {
      schema = purity.Schema({
        data: { $type: Number, $transform: ['$inc:300', '$mul:2'] }
      });
    });

    it('Should pass on transforming a number', function (done) {
      schema.transform({ data: 2 }, function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql({ data: 604 });
        done();
      });
    });
  });

  describe('With assertions', function () {
    beforeEach(function () {
      schema = purity.Schema({
        data: { $type: Number, $lt: 10 }
      });

      it('Should pass on transforming a number lt 10', function (done) {
        schema.transform({ data: 2 }, function (e, r) {
          expect(e).to.be.null;
          expect(r).to.eql({ data: 604 });
          done();
        });
      });

      it('Should pass on transforming a number gt 10', function (done) {
        schema.transform({ data: 100 }, function (e, r) {
          expect(e).to.be.null;
          expect(r).to.eql({ data: 800 });
          done();
        });
      });
    });
  });
});
