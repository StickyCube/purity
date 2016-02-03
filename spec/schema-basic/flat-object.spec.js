'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var purity = require('../../dist/purity');

var onResolve = sinon.stub();
var onReject = sinon.stub();

describe('Basic flat object Schema', function () {
  var schema = null;

  beforeEach(function () {
    onResolve.reset();
    onReject.reset();
  });

  describe('When not using $type syntax', function () {
    beforeEach(function () {
      schema = new purity.Schema({
        foo: Number,
        bar: String
      });
    });

    it('Should resolve a valid object', function (done) {
      schema
        .validate({ foo: 123, bar: 'abc' })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql({ foo: 123, bar: 'abc' });
          done();
        });
    });

    it('Should reject when at least one value is invalid', function (done) {
      schema
        .validate({ foo: 123, bar: 456 })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When using $type syntax', function () {
    beforeEach(function () {
      schema = new purity.Schema({
        foo: { $type: Number },
        bar: { $type: String }
      });
    });

    it('Should resolve a valid object', function (done) {
      schema
        .validate({ foo: 123, bar: 'abc' })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql({ foo: 123, bar: 'abc' });
          done();
        });
    });

    it('Should reject when at least one value is invalid', function (done) {
      schema
        .validate({ foo: 123, bar: 456 })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When using existing schemas', function () {
    beforeEach(function () {
      var numberSchema = new purity.Schema(Number);
      var stringSchema = new purity.Schema(String);

      schema = new purity.Schema({
        foo: numberSchema,
        bar: stringSchema
      });
    });

    it('Should resolve a valid object', function (done) {
      schema
        .validate({ foo: 123, bar: 'abc' })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql({ foo: 123, bar: 'abc' });
          done();
        });
    });

    it('Should reject when at least one value is invalid', function (done) {
      schema
        .validate({ foo: 123, bar: 456 })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });
});
