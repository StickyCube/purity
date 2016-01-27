'use strict';

let expect = require('chai').expect;
let sandbox = require('sinon').sandbox.create();

let Schema = require('../../../src/purity').Schema;

let onResolve = sandbox.stub();
let onReject = sandbox.stub();

describe('Basic value array schema', function () {
  let schema = null;

  afterEach(function () {
    onResolve.reset();
    onReject.reset();
  });

  describe('When not using the $type syntax', function () {
    beforeEach(function () {
      schema = new Schema([{ foo: Number, bar: String }]);
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
      schema = new Schema([{
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
    let reference = null;

    before(function () {
      reference = new Schema({
        foo: { $type: Number },
        bar: { $type: String }
      });
    });

    beforeEach(function () {
      schema = new Schema([reference]);
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
    let reference = null;

    before(function () {
      reference = new Schema([{
        foo: { $type: Number },
        bar: { $type: String }
      }]);
    });

    beforeEach(function () {
      schema = new Schema(reference);
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
