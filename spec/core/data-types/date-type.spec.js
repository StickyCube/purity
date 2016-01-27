'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let purity = require('../../../src/purity');

let actual = null;
let expected = null;

let onResolve = null;
let onReject = null;

describe('Date Type Validator', function () {
  let DataTypeValidator = null;
  let validator = null;

  before(function () {
    DataTypeValidator = purity.DataTypeValidator;
  });

  beforeEach(function () {
    onResolve = sinon.spy();
    onReject = sinon.spy();
  });

  it('Should have a Date type defined', function () {
    expect(DataTypeValidator.Types.Date).to.be.defined;
  });

  describe('casting', function () {
    beforeEach(function () {
      validator = DataTypeValidator.create({ $type: Date });
    });

    it('Should cast number values', function () {
      let dt = validator.cast(1458629384643);
      actual = dt.toDateString();
      expected = 'Tue Mar 22 2016';
      expect(actual).to.eql(expected);
    });

    it('Should cast string values', function () {
      let dt = validator.cast('Tue Jan 26 2016');
      actual = dt.getTime();
      expected = 1453766400000;
      expect(actual).to.eql(expected);
    });

    it('Should cast null values', function () {
      let dt = validator.cast(null);
      actual = dt.toString();
      expected = 'Invalid Date';
      expect(actual).to.eql(expected);
    });

    it('Should cast undefined values', function () {
      let dt = validator.cast(undefined);
      actual = dt.toString();
      expected = 'Invalid Date';
      expect(actual).to.eql(expected);
    });
  });

  describe('check type', function () {
    it('Should only return true when a date', function () {
      expect(validator.checkType('abc')).to.be.false;
      expect(validator.checkType(new Date())).to.be.true;
      expect(validator.checkType(123)).to.be.false;
      expect(validator.checkType(false)).to.be.false;
      expect(validator.checkType(NaN)).to.be.false;
      expect(validator.checkType(null)).to.be.false;
      expect(validator.checkType(undefined)).to.be.false;
    });
  });

  describe('assertions', function () {
    describe('$gt', function () {
      describe('With Numbers', function () {
        beforeEach(function () {
          validator = DataTypeValidator.create({ $type: Date, $gt: Date.now() });
        });

        it('Should reject when date is in the past', function (done) {
          validator
          .validate(new Date(5000))
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
        });

        it('Should resolve when date is in the future', function (done) {
          validator
          .validate(new Date(Date.now() + 50000000))
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
        });
      });

      describe('With Dates', function () {
        beforeEach(function () {
          validator = DataTypeValidator.create({ $type: Date, $gt: new Date() });
        });

        it('Should reject when date is in the past', function (done) {
          validator
          .validate(new Date(5000))
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
        });

        it('Should resolve when date is in the future', function (done) {
          validator
          .validate(new Date(Date.now() + 5000000))
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
        });
      });
    });

    describe('$lt', function () {
      describe('With Numbers', function () {
        beforeEach(function () {
          validator = DataTypeValidator.create({ $type: Date, $lt: Date.now() });
        });

        it('Should reject when date is in the future', function (done) {
          validator
          .validate(new Date())
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
        });

        it('Should resolve when date is in the past', function (done) {
          validator
          .validate(new Date(50000))
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
        });
      });

      describe('With Dates', function () {
        beforeEach(function () {
          validator = DataTypeValidator.create({ $type: Date, $lt: new Date() });
        });

        it('Should reject when date is in the future', function (done) {
          validator
          .validate(new Date())
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
        });

        it('Should resolve when date is in the past', function (done) {
          validator
          .validate(new Date(5000))
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
        });
      });
    });
  });
});
