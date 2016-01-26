'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let purity = require('../../src/purity');

let actual = null;
let expected = null;

let onResolve = null;
let onReject = null;

describe('Boolean Type Validator', function () {
  let DataTypeValidator = null;
  let validator = null;

  before(function () {
    DataTypeValidator = purity.DataTypeValidator;
  });

  beforeEach(function () {
    onResolve = sinon.spy();
    onReject = sinon.spy();
  });

  it('Should have a Boolean type defined', function () {
    expect(DataTypeValidator.Types.Boolean).to.be.defined;
  });

  describe('casting', function () {
    beforeEach(function () {
      validator = DataTypeValidator.create({ $type: Boolean });
    });

    it('Should cast number values - true', function () {
      actual = validator.cast(12345);
      expected = true;
      expect(actual).to.eql(expected);
    });

    it('Should cast number values - false', function () {
      actual = validator.cast(0);
      expected = false;
      expect(actual).to.eql(expected);
    });

    it('Should cast string values - true', function () {
      actual = validator.cast('foo');
      expected = true;
      expect(actual).to.eql(expected);
    });

    it('Should cast string values - false', function () {
      actual = validator.cast('');
      expected = false;
      expect(actual).to.eql(expected);
    });

    it('Should cast null values', function () {
      actual = validator.cast(null);
      expected = false;
      expect(actual).to.eql(expected);
    });

    it('Should cast undefined values', function () {
      actual = validator.cast(undefined);
      expected = false;
      expect(actual).to.eql(expected);
    });
  });

  describe('check type', function () {
    it('Should only return true when a boolean', function () {
      expect(validator.checkType('abc')).to.be.false;
      expect(validator.checkType(123)).to.be.false;
      expect(validator.checkType(false)).to.be.true;
      expect(validator.checkType(NaN)).to.be.false;
      expect(validator.checkType(null)).to.be.false;
      expect(validator.checkType(undefined)).to.be.false;
    });
  });

  describe('assertions', function () {
    describe('$eq', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Boolean, $eq: true });
      });

      it('Should reject when false', function (done) {
        validator
          .validate(false)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when true', function (done) {
        validator
          .validate(true)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });

    describe('$neq', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Boolean, $neq: false });
      });

      it('Should reject when false', function (done) {
        validator
          .validate(false)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when true', function (done) {
        validator
          .validate(true)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });
  });

  describe('mutators', function () {
    describe('$not', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Boolean, $not: true });
      });

      it('Should negate', function (done) {
        validator
          .validate(false)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            expect(onResolve.firstCall.args[0].value).to.equal(true);
            done();
          });
      });
    });
  });
});
