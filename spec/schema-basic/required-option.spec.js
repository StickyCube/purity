'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var purity = require('../../dist/purity');

var onResolve = sinon.stub();
var onReject = sinon.stub();

describe('$required option', function () {
  var schema = null;

  beforeEach(function () {
    onResolve.reset();
    onReject.reset();
  });

  describe('With no $required option', function () {
    before(function () {
      schema = purity.Schema({ $type: Number });
    });

    it('Should resolve with undefined', function (done) {
      return schema
        .validate(null)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args).to.eql([undefined]);
          done();
        });
    });
  });

  describe('With $required = true option', function () {
    before(function () {
      schema = purity.Schema({ $type: Number, $required: true });
    });

    it('Should reject', function (done) {
      return schema
        .validate(null)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });
});
