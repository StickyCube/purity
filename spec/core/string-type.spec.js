'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');

let purity = require('../../src/purity');

let actual = null;
let expected = null;

let onResolve = null;
let onReject = null;

describe('String Type Validator', function () {
  let DataTypeValidator = null;
  let validator = null;

  before(function () {
    DataTypeValidator = purity.DataTypeValidator;
  });

  beforeEach(function () {
    onResolve = sinon.spy();
    onReject = sinon.spy();
  });

  it('Should have a String type defined', function () {
    expect(DataTypeValidator.Types.String).to.be.defined;
  });

  describe('casting', function () {
    beforeEach(function () {
      validator = DataTypeValidator.create({ $type: String });
    });

    it('Should cast integer number values', function () {
      actual = validator.cast(12345);
      expected = '12345';
      expect(actual).to.eql(expected);
    });

    it('Should cast floating point number values', function () {
      actual = validator.cast(12.345);
      expected = '12.345';
      expect(actual).to.eql(expected);
    });

    it('Should cast boolean values', function () {
      actual = validator.cast(true);
      expected = 'true';
      expect(actual).to.eql(expected);
    });

    it('Should cast null values', function () {
      actual = validator.cast(null);
      expected = 'null';
      expect(actual).to.eql(expected);
    });

    it('Should cast undefined values', function () {
      actual = validator.cast(undefined);
      expected = 'undefined';
      expect(actual).to.eql(expected);
    });
  });

  describe('check type', function () {
    it('Should only return true when a string', function () {
      expect(validator.checkType('abc')).to.be.true;
      expect(validator.checkType(123)).to.be.false;
      expect(validator.checkType(false)).to.be.false;
      expect(validator.checkType(NaN)).to.be.false;
      expect(validator.checkType(null)).to.be.false;
      expect(validator.checkType(undefined)).to.be.false;
    });
  });

  describe('assertions', function () {
    describe('$minlength', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: String, $minlength: 4 });
      });

      it('Should reject when length < 4', function (done) {
        validator
          .validate('abc')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when length >= 4', function (done) {
        validator
          .validate('abcf')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });

    describe('$maxlength', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: String, $maxlength: 4 });
      });

      it('Should reject when length > 4', function (done) {
        validator
          .validate('abcff')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when length <= 4', function (done) {
        validator
          .validate('abcf')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });

    describe('$fixedwidth', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: String, $fixedwidth: 4 });
      });

      it('Should reject when length !== 4', function (done) {
        validator
          .validate('abc')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when length === 4', function (done) {
        validator
          .validate('abcf')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            done();
          });
      });
    });

    describe('$regex', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: String, $regex: /^(foo|bar)/ });
      });

      it('Should reject when it does not match', function (done) {
        validator
          .validate('baz foo')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.true;
            expect(onResolve.called).to.be.false;
            done();
          });
      });

      it('Should resolve when it matches', function (done) {
        validator
          .validate('foo baz')
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
    describe('$toupper', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: String, $toupper: true });
      });

      it('Should convert to upper case', function (done) {
        validator
          .validate('foobar')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            expect(onResolve.firstCall.args[0].value).to.equal('FOOBAR');
            done();
          });
      });
    });

    describe('$tolower', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: String, $tolower: true });
      });

      it('Should convert to lower case', function (done) {
        validator
          .validate('FOOBAR')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            expect(onResolve.firstCall.args[0].value).to.equal('foobar');
            done();
          });
      });
    });

    describe('$replace', function () {
      beforeEach(function () {
        validator = DataTypeValidator.create({ $type: String, $replace: [/(foo|bar)/g, 'baz'] });
      });

      it('Should convert to lower case', function (done) {
        validator
          .validate('hello, i am foo and i like to bar')
          .then(onResolve, onReject)
          .then(function () {
            expect(onReject.called).to.be.false;
            expect(onResolve.called).to.be.true;
            expect(onResolve.firstCall.args[0].value).to.equal('hello, i am baz and i like to baz');
            done();
          });
      });
    });
  });
});
