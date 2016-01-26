'use strict';

let expect = require('chai').expect;
let rewire = require('rewire');
let sinon = require('sinon');

let DataTypeValidator = null;
let Validator = null;
let validator = null;

let onResolve = null;
let onReject = null;

let definition = {
  aliases: [Number],
  checkType: v => typeof v === 'number',
  cast: v => parseFloat(v),
  assertions: {
    $test1: sinon.stub().returns(true),
    $test2: sinon.stub().returns(false),
    $test3: sinon.stub().returns(true)
  }
};

describe('#_applyAssertions', function () {
  before(function () {
    DataTypeValidator = rewire('../../src/data-type-validator');
    Validator = DataTypeValidator.define('Number', definition);
  });

  beforeEach(function () {
    onResolve = sinon.spy();
    onReject = sinon.spy();
  });

  describe('When the expected type is invalid', function () {
    beforeEach(function () {
      validator = new Validator({ $type: 'Number', $test1: true });
    });

    it('Should reject if checkType fails', function (done) {
      validator
        ._applyAssertions('foobar')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When one option is specified', function () {
    beforeEach(function () {
      validator = new Validator({ $type: 'Number', $test1: true });
    });

    it('Should use the assertion provided', function (done) {
      validator
        ._applyAssertions(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(definition.assertions.$test1.called).to.be.true;
          done();
        });
    });

    it('Should not use any other assertions', function (done) {
      validator
        ._applyAssertions(123)
        .then(onResolve, onReject)
        .then(function () {
          expect(definition.assertions.$test2.called).to.be.false;
          done();
        });
    });
  });

  describe('When a single assertion fails', function () {
    beforeEach(function () {
      validator = new Validator({ $type: 'Number', $test2: true });
    });

    it('Should reject', function (done) {
      validator
        ._applyAssertions(12345)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When one of two assertions fail', function () {
    beforeEach(function () {
      validator = new Validator({ $type: 'Number', $test2: true, $test1: true });
    });

    it('Should reject', function (done) {
      validator
        ._applyAssertions(12345)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When all assertions pass', function () {
    beforeEach(function () {
      validator = new Validator({ $type: 'Number', $test1: true, $test3: true });
    });

    it('Should resolve', function (done) {
      validator
        ._applyAssertions(12345)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          done();
        });
    });
  });
});
