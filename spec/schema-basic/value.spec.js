'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var purity = require('../../src/purity');

var onResolve = sinon.stub();
var onReject = sinon.stub();

describe('Basic value schema', function () {
  var schema = null;

  afterEach(function () {
    onResolve.reset();
    onReject.reset();
  });

  describe('When not using the $type syntax', function () {
    beforeEach(function () {
      schema = purity.Schema(Number);
    });

    it('Should validate a number correctly', function (done) {
      schema
        .validate(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql(123);
          done();
        });
    });

    it('Should reject a string', function (done) {
      schema
        .validate('abc')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When using the $type syntax', function () {
    beforeEach(function () {
      schema = purity.Schema({ $type: Number });
    });

    it('Should validate a number correctly', function (done) {
      schema
        .validate(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql(123);
          done();
        });
    });

    it('Should reject a string', function (done) {
      schema
        .validate('abc')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
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
      schema
        .validate(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql(123);
          done();
        });
    });

    it('Should reject a string', function (done) {
      schema
        .validate('abc')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });
});