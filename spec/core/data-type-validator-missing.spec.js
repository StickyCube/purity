'use strict';

let expect = require('chai').expect;
let rewire = require('rewire');
let sinon = require('sinon');

let DataTypeValidator = null;
let validator = null;

var onResolve = null;
var onReject = null;

beforeEach(function () {
  DataTypeValidator = rewire('../../src/data-type-validator');
  onResolve = sinon.spy();
  onReject = sinon.spy();
});

describe('When null|undefined are passed to the validator', function () {
  describe('$required is true', function () {
    beforeEach(function () {
      validator = new DataTypeValidator({ $required: true });
    });

    it('Should reject', function (done) {
      validator
        .validate(null)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('$required is false', function () {
    beforeEach(function () {
      validator = new DataTypeValidator({ $required: false });
    });

    it('Should resolve with undefined', function (done) {
      validator
        .validate(null)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0].value).not.to.be.defined;
          done();
        });
    });
  });

  describe('$default is defined but $required is false', function () {
    beforeEach(function () {
      validator = new DataTypeValidator({ $default: 123456 });
    });

    it('Should resolve with 123456', function (done) {
      validator
        .validate(null)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0].value).to.equal(123456);
          done();
        });
    });
  });

  describe('$default is defined and $required is true', function () {
    beforeEach(function () {
      validator = new DataTypeValidator({ $default: 123456, $required: true });
    });

    it('Should resolve with 123456', function (done) {
      validator
        .validate(null)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0].value).to.equal(123456);
          done();
        });
    });
  });
});
