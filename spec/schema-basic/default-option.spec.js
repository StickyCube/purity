'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var purity = require('../../dist/purity');

var onResolve = sinon.stub();
var onReject = sinon.stub();

describe('$default option', function () {
  var schema = null;

  beforeEach(function () {
    onResolve.reset();
    onReject.reset();
  });

  describe('With no default option', function () {
    before(function () {
      schema = new purity.Schema({ $type: Number });
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

  describe('When $default is a static value', function () {
    before(function () {
      schema = new purity.Schema({ $type: Number, $default: 123 });
    });

    it('Should resolve with the given value', function (done) {
      return schema
        .validate(null)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args).to.eql([123]);
          done();
        });
    });
  });

  describe('When $default is a function', function () {
    before(function () {
      var fn = function () { return 12345; };
      schema = new purity.Schema({ $type: Number, $default: fn });
    });

    it('Should resolve with the function return value', function (done) {
      return schema
        .validate(null)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args).to.eql([12345]);
          done();
        });
    });
  });
});
