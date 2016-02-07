'use strict';

var expect = require('chai').expect;
var purity = require('../../src/purity');

describe('Defining a data type', function () {
  describe('API', function () {
    it('Should expose a module on the root export', function () {
      expect(purity.createDataType).to.be.defined;
    });
  });

  describe('When a type is defined with no aliases option', function () {
    it('Should throw', function () {
      expect(function () {
        purity.createDataType({});
      }).to.throw();
    });
  });

  describe('When a type with an alias which is already in use is defined', function () {
    it('Should throw', function () {
      expect(function () {
        purity.createDataType({ aliases: ['Alias_1'] });
        purity.createDataType({ aliases: ['Alias_1'] });
      }).to.throw();
    });
  });

  describe('Using Schemas with a custom type', function () {
    before(function () {
      purity.createDataType({ aliases: ['Alias_2'] });
    });

    describe('Creating a schema', function () {
      it('Should create the schema without throwing', function () {
        expect(function () {
          return purity.Schema({ $type: 'Alias_2' });
        }).not.to.throw();
      });
    });

    describe('default behaviors', function () {
      var schema = null;

      before(function () {
        schema = purity.Schema({ $type: 'Alias_2' });
      });

      it('Should reject an array', function (done) {
        schema.validate([], function (err, res) {
          expect(err).not.to.be.null;
          done();
        });
      });

      var types = {
        string: 'abc',
        number: 123,
        bool: false,
        object: {},
        null: null,
        undefined: undefined
      };

      for (var name in types) {
        var value = types[name];
        it(`Should resolve ${name}`, function (done) {
          schema.validate(value, function (e, r) {
            expect(e).to.be.null;
            expect(r).to.eql(value);
            done();
          });
        });
      }
    });

    describe('type checking', function () {
      var schema = null;
      var opts = {
        aliases: ['Alias_3'],
        checkType: function (v) { return typeof v === 'string' || typeof v === 'number'; }
      };

      before(function () {
        purity.createDataType(opts);
      });

      before(function () {
        schema = purity.Schema({ $type: 'Alias_3' });
      });

      it('Should resolve for null', function (done) {
        return schema.validate(null, function (e, r) {
          expect(e).to.be.null;
          expect(r).to.eql(null);
          done();
        });
      });

      it('Should resolve for undefined', function (done) {
        return schema.validate(undefined, function (e, r) {
          expect(e).to.be.null;
          expect(r).to.eql(undefined);
          done();
        });
      });

      it('Should resolve for string', function (done) {
        return schema.validate('abc', function (e, r) {
          expect(e).to.be.null;
          expect(r).to.eql('abc');
          done();
        });
      });

      it('Should resolve for number', function (done) {
        return schema.validate(123, function (e, r) {
          expect(e).to.be.null;
          expect(r).to.eql(123);
          done();
        });
      });

      it('Should reject for bool', function (done) {
        return schema.validate(true, function (e, r) {
          expect(e).not.to.be.null;
          done();
        });
      });

      it('Should reject for object', function (done) {
        return schema.validate({}, function (e, r) {
          expect(e).not.to.be.null;
          done();
        });
      });
    });
  });
});
