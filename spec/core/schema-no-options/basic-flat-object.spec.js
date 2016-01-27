'use strict';

let expect = require('chai').expect;
let sandbox = require('sinon').sandbox.create();

let Schema = require('../../../src/purity').Schema;

let onResolve = sandbox.stub();
let onReject = sandbox.stub();

describe('Basic flat object Schema', function () {
  let schema = null;

  beforeEach(function () {
    onResolve.reset();
    onReject.reset();
  });

  describe('When not using $type syntax', function () {
    beforeEach(function () {
      schema = new Schema({
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
      schema = new Schema({
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
      let numberSchema = new Schema(Number);
      let stringSchema = new Schema(String);

      schema = new Schema({
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
