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
  checkType: sinon.stub().returns(true),
  cast: v => parseFloat(v),
  assertions: {
    $fail: sinon.stub().returns(false)
  }
};

describe('#_validateData', function () {
  before(function () {
    DataTypeValidator = rewire('../../../src/data-type-validator');
    Validator = DataTypeValidator.define('Number', definition);
  });

  beforeEach(function () {
    onResolve = sinon.stub();
    onReject = sinon.stub();
  });

  describe('When an assertion fails', function () {
    beforeEach(function () {
      validator = new Validator({ $type: Number, $fail: true });
    });

    it('Should reject', function (done) {
      validator
        .validate(12345)
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });

  describe('When no $cast option is provided', function () {
    beforeEach(function () {
      validator = new Validator({ $type: Number });
    });

    it('Should not attempt to cast the data', function (done) {
      validator
        .validate('12345')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0].value).to.eql('12345');
          done();
        });
    });
  });

  describe('When $cast option is explicitly true', function () {
    beforeEach(function () {
      validator = new Validator({ $type: Number, $cast: true });
    });

    it('Should attempt to cast the data', function (done) {
      validator
        .validate('12345')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0].value).to.eql(12345);
          done();
        });
    });
  });

  describe('When $cast option is explicitly false', function () {
    beforeEach(function () {
      validator = new Validator({ $type: Number, $cast: false });
    });

    it('Should not attempt to cast the data', function (done) {
      validator
        .validate('12345')
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0].value).to.eql('12345');
          done();
        });
    });
  });
});
