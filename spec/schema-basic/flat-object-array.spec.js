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
      schema = purity.Schema([{ foo: Number, bar: String }]);
    });

    it('Should reject a non array value of a valid object', function (done) {
      schema
        .validate({ foo: 123, bar: 'abc' })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should reject a non array value of an invalid object', function (done) {
      schema
        .validate({ foo: 123, bar: 456 })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should validate an array of valid objects', function (done) {
      schema
        .validate([
          { foo: 123, bar: 'abc' },
          { foo: 456, bar: 'def' },
          { foo: 789, bar: 'ghi' }
        ])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql([
            { foo: 123, bar: 'abc' },
            { foo: 456, bar: 'def' },
            { foo: 789, bar: 'ghi' }
          ]);
          done();
        });
    });

    it('Should reject an array of invalid objects', function (done) {
      schema
        .validate([
          { foo: 123, bar: 12345 },
          { foo: 456, bar: 12345 },
          { foo: 789, bar: 12345 }
        ])
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
      schema = purity.Schema([{
        foo: { $type: Number },
        bar: { $type: String }
      }]);
    });

    it('Should reject a non array value of a valid object', function (done) {
      schema
        .validate({ foo: 123, bar: 'abc' })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should reject a non array value of an invalid object', function (done) {
      schema
        .validate({ foo: 123, bar: 456 })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should validate an array of valid objects', function (done) {
      schema
        .validate([
          { foo: 123, bar: 'abc' },
          { foo: 456, bar: 'def' },
          { foo: 789, bar: 'ghi' }
        ])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql([
            { foo: 123, bar: 'abc' },
            { foo: 456, bar: 'def' },
            { foo: 789, bar: 'ghi' }
          ]);
          done();
        });
    });

    it('Should reject an array of invalid objects', function (done) {
      schema
        .validate([
          { foo: 123, bar: 12345 },
          { foo: 456, bar: 12345 },
          { foo: 789, bar: 12345 }
        ])
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
      reference = purity.Schema({
        foo: { $type: Number },
        bar: { $type: String }
      });
    });

    beforeEach(function () {
      schema = purity.Schema([reference]);
    });

    it('Should reject a non array value of a valid object', function (done) {
      schema
        .validate({ foo: 123, bar: 'abc' })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should reject a non array value of an invalid object', function (done) {
      schema
        .validate({ foo: 123, bar: 456 })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should validate an array of valid objects', function (done) {
      schema
        .validate([
          { foo: 123, bar: 'abc' },
          { foo: 456, bar: 'def' },
          { foo: 789, bar: 'ghi' }
        ])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql([
            { foo: 123, bar: 'abc' },
            { foo: 456, bar: 'def' },
            { foo: 789, bar: 'ghi' }
          ]);
          done();
        });
    });

    it('Should reject an array of invalid objects', function (done) {
      schema
        .validate([
          { foo: 123, bar: 12345 },
          { foo: 456, bar: 12345 },
          { foo: 789, bar: 12345 }
        ])
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
      reference = purity.Schema([{
        foo: { $type: Number },
        bar: { $type: String }
      }]);
    });

    beforeEach(function () {
      schema = purity.Schema(reference);
    });

    it('Should reject a non array value of a valid object', function (done) {
      schema
        .validate({ foo: 123, bar: 'abc' })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should reject a non array value of an invalid object', function (done) {
      schema
        .validate({ foo: 123, bar: 456 })
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });

    it('Should validate an array of valid objects', function (done) {
      schema
        .validate([
          { foo: 123, bar: 'abc' },
          { foo: 456, bar: 'def' },
          { foo: 789, bar: 'ghi' }
        ])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.true;
          expect(onReject.called).to.be.false;
          expect(onResolve.firstCall.args[0]).to.eql([
            { foo: 123, bar: 'abc' },
            { foo: 456, bar: 'def' },
            { foo: 789, bar: 'ghi' }
          ]);
          done();
        });
    });

    it('Should reject an array of invalid objects', function (done) {
      schema
        .validate([
          { foo: 123, bar: 12345 },
          { foo: 456, bar: 12345 },
          { foo: 789, bar: 12345 }
        ])
        .then(onResolve, onReject)
        .then(function () {
          expect(onResolve.called).to.be.false;
          expect(onReject.called).to.be.true;
          done();
        });
    });
  });
});
