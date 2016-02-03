'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var purity = require('../../dist/purity');

var onResolve = sinon.stub();
var onReject = sinon.stub();

describe('Basic value array schema', function () {
  var schema = null;

  afterEach(function () {
    onResolve.reset();
    onReject.reset();
  });

  describe('When not using the $type syntax', function () {
    beforeEach(function () {
      schema = new purity.Schema([Number]);
    });

    it('Should reject a non array value of a valid type', function (done) {
      schema
        .validate(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should reject a non array value of an invalid type', function (done) {
      schema
        .validate('abc')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should validate an array of numbers correctly', function (done) {
      schema
        .validate([123, 456, 789])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql([123, 456, 789]);
          done();
        });
    });

    it('Should reject an array of strings', function (done) {
      schema
        .validate(['abc', 'def', 'ghi'])
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
      schema = new purity.Schema([{ $type: Number }]);
    });

    it('Should reject a non array value of a valid type', function (done) {
      schema
        .validate(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should reject a non array value of an invalid type', function (done) {
      schema
        .validate('abc')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should validate a number correctly', function (done) {
      schema
        .validate([123, 456, 789])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql([123, 456, 789]);
          done();
        });
    });

    it('Should reject a string', function (done) {
      schema
        .validate(['abc', 'def', 'ghi'])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When using an existing (single value) Schema', function () {
    var reference = null;

    before(function () {
      reference = new purity.Schema({ $type: Number });
    });

    beforeEach(function () {
      schema = new purity.Schema([reference]);
    });

    it('Should reject a non array value of a valid type', function (done) {
      schema
        .validate(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should reject a non array value of an invalid type', function (done) {
      schema
        .validate('abc')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should validate a number correctly', function (done) {
      schema
        .validate([123, 456, 789])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql([123, 456, 789]);
          done();
        });
    });

    it('Should reject a string', function (done) {
      schema
        .validate(['abc', 'def', 'ghi'])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When using an existing (array value) Schema', function () {
    var reference = null;

    before(function () {
      reference = new purity.Schema([{ $type: Number }]);
    });

    beforeEach(function () {
      schema = new purity.Schema(reference);
    });

    it('Should reject a non array value of a valid type', function (done) {
      schema
        .validate(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should reject a non array value of an invalid type', function (done) {
      schema
        .validate('abc')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should validate a number correctly', function (done) {
      schema
        .validate([123, 456, 789])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql([123, 456, 789]);
          done();
        });
    });

    it('Should reject a string', function (done) {
      schema
        .validate(['abc', 'def', 'ghi'])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });
});
