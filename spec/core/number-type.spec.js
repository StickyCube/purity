'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let purity = require('../../src/purity');

let actual = null;
let expected = null;

let onResolve = null;
let onReject = null;

describe('Number Type Validator', function () {
  let DataTypeValidator = null;
  let validator = null;

  before(function () {
    DataTypeValidator = purity.DataTypeValidator;
  });

  beforeEach(function () {
    onResolve = sinon.spy();
    onReject = sinon.spy();
  });

  it('Should have a Number type defined', function () {
    expect(DataTypeValidator.Types.Number).to.be.defined;
  });

  describe('casting', function () {
    beforeEach(function () {
      validator = DataTypeValidator.create({ $type: Number });
    });

    it('Should cast numeric string values', function () {
      actual = validator.cast('123456');
      expected = 123456;
      expect(actual).to.eql(expected);
    });

    it('Should cast non numeric string values to 0', function () {
      actual = validator.cast('foo');
      expected = 0;
      expect(actual).to.eql(expected);
    });

    it('Should cast null values to 0', function () {
      actual = validator.cast(null);
      expected = 0;
      expect(actual).to.eql(expected);
    });

    it('Should cast undefined values to 0', function () {
      actual = validator.cast(undefined);
      expected = 0;
      expect(actual).to.eql(expected);
    });

    it('Should cast boolean values to 1 when true', function () {
      actual = validator.cast(true);
      expected = 1;
      expect(actual).to.eql(expected);
    });

    it('Should cast boolean values to 0 when false', function () {
      actual = validator.cast(false);
      expected = 0;
      expect(actual).to.eql(expected);
    });
  });

  describe('check type', function () {
    beforeEach(function () {
      validator = DataTypeValidator.create({ $type: Number });
    });

    it('Should only return true when a number', function () {
      expect(validator.checkType('abc')).to.be.false;
      expect(validator.checkType(123)).to.be.true;
      expect(validator.checkType(false)).to.be.false;
      expect(validator.checkType(NaN)).to.be.false;
      expect(validator.checkType(null)).to.be.false;
      expect(validator.checkType(undefined)).to.be.false;
    });
  });

  describe('assertions', function () {
    describe('$eq', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Number, $eq: 100 });
      });

      it('Should reject when not equal 100', function (done) {
        validator
          .validate(200)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when equal to 100', function (done) {
        validator
          .validate(100)
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
        validator = DataTypeValidator.create({ $type: Number, $neq: 100 });
      });

      it('Should reject when equal to 100', function (done) {
        validator
          .validate(100)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when not equal to 100', function (done) {
        validator
          .validate(200)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });

    describe('$gt', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Number, $gt: 100 });
      });

      it('Should reject when lte 100', function (done) {
        validator
          .validate(100)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when gt 100', function (done) {
        validator
          .validate(200)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });

    describe('$gte', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Number, $gte: 100 });
      });

      it('Should reject when lt 100', function (done) {
        validator
          .validate(50)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when gte 100', function (done) {
        validator
          .validate(200)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });

    describe('$lt', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Number, $lt: 100 });
      });

      it('Should reject when gte 100', function (done) {
        validator
          .validate(100)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when lt 100', function (done) {
        validator
          .validate(50)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });

    describe('$lte', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Number, $lte: 100 });
      });

      it('Should reject when gt 100', function (done) {
        validator
          .validate(200)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when lte 100', function (done) {
        validator
          .validate(50)
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
    describe('$tofixed', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: Number, $tofixed: 3 });
      });

      it('Should set the precision to 3dp', function (done) {
        validator
          .validate(3.14159)
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            expect(onResolve.firstCall.args[0].value).to.equal('3.142');
            done();
          });
      });
    });
  });
});
