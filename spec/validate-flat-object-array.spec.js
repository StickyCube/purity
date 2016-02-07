'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Flat object array schema', function () {
  var schema = null;

  describe('When not using the $type syntax', function () {
    beforeEach(function () {
      schema = purity.Schema([{ foo: Number, bar: String }]);
    });

    it('Should reject a non array value of a valid object', function (done) {
      schema.validate({ foo: 123, bar: 'abc' }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should reject a non array value of an invalid object', function (done) {
      schema.validate({ foo: 123, bar: 456 }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should validate an array of valid objects', function (done) {
      schema.validate([
        { foo: 123, bar: 'abc' },
        { foo: 456, bar: 'def' },
        { foo: 789, bar: 'ghi' }
      ], function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql([
          { foo: 123, bar: 'abc' },
          { foo: 456, bar: 'def' },
          { foo: 789, bar: 'ghi' }
        ]);
        done();
      });
    });

    it('Should reject an array of invalid objects', function (done) {
      schema.validate([
        { foo: 123, bar: 12345 },
        { foo: 456, bar: 12345 },
        { foo: 789, bar: 12345 }
      ], function (e, r) {
        expect(e).not.to.be.null;
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
      schema.validate({ foo: 123, bar: 'abc' }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should reject a non array value of an invalid object', function (done) {
      schema.validate({ foo: 123, bar: 456 }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should validate an array of valid objects', function (done) {
      schema.validate([
        { foo: 123, bar: 'abc' },
        { foo: 456, bar: 'def' },
        { foo: 789, bar: 'ghi' }
      ], function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql([
          { foo: 123, bar: 'abc' },
          { foo: 456, bar: 'def' },
          { foo: 789, bar: 'ghi' }
        ]);
        done();
      });
    });

    it('Should reject an array of invalid objects', function (done) {
      schema.validate([
        { foo: 123, bar: 12345 },
        { foo: 456, bar: 12345 },
        { foo: 789, bar: 12345 }
      ], function (e, r) {
        expect(e).not.to.be.null;
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
      schema.validate({ foo: 123, bar: 'abc' }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should reject a non array value of an invalid object', function (done) {
      schema.validate({ foo: 123, bar: 456 }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should validate an array of valid objects', function (done) {
      schema.validate([
        { foo: 123, bar: 'abc' },
        { foo: 456, bar: 'def' },
        { foo: 789, bar: 'ghi' }
      ], function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql([
          { foo: 123, bar: 'abc' },
          { foo: 456, bar: 'def' },
          { foo: 789, bar: 'ghi' }
        ]);
        done();
      });
    });

    it('Should reject an array of invalid objects', function (done) {
      schema.validate([
        { foo: 123, bar: 12345 },
        { foo: 456, bar: 12345 },
        { foo: 789, bar: 12345 }
      ], function (e, r) {
        expect(e).not.to.be.null;
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
      schema.validate({ foo: 123, bar: 'abc' }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should reject a non array value of an invalid object', function (done) {
      schema.validate({ foo: 123, bar: 456 }, function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });

    it('Should validate an array of valid objects', function (done) {
      schema.validate([
        { foo: 123, bar: 'abc' },
        { foo: 456, bar: 'def' },
        { foo: 789, bar: 'ghi' }
      ], function (e, r) {
        expect(e).to.be.null;
        expect(r).to.eql([
          { foo: 123, bar: 'abc' },
          { foo: 456, bar: 'def' },
          { foo: 789, bar: 'ghi' }
        ]);
        done();
      });
    });

    it('Should reject an array of invalid objects', function (done) {
      schema.validate([
        { foo: 123, bar: 12345 },
        { foo: 456, bar: 12345 },
        { foo: 789, bar: 12345 }
      ], function (e, r) {
        expect(e).not.to.be.null;
        done();
      });
    });
  });
});
