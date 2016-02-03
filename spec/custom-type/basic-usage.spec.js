'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var purity = require('../../src/purity');

var onResolve = sinon.stub();
var onReject = sinon.stub();

var assertPass = function (done) {
  return function () {
    expect(onResolve.called).to.be.true;
    expect(onReject.called).to.be.false;
    done();
  };
};

var assertFail = function (done) {
  return function () {
    expect(onResolve.called).to.be.false;
    expect(onReject.called).to.be.true;
    done();
  };
};

describe('Defining a data type', function () {
  beforeEach(function () {
    onResolve.reset();
    onReject.reset();
  });

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
          return new purity.Schema({ $type: 'Alias_2' });
        }).not.to.throw();
      });
    });

    describe('default behaviors', function () {
      var schema = null;

      before(function () {
        schema = new purity.Schema({ $type: 'Alias_2' });
      });

      it('Should reject an array', function (done) {
        schema.validate([]).then(onResolve, onReject).then(assertFail(done));
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
          schema.validate(value)
            .then(onResolve, onReject)
            .then(assertPass(done));
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
        schema = new purity.Schema({ $type: 'Alias_3' });
      });

      it('Should resolve for null', function (done) {
        return schema.validate(null)
          .then(onResolve, onReject)
          .then(assertPass(done));
      });

      it('Should resolve for undefined', function (done) {
        return schema.validate(undefined)
          .then(onResolve, onReject)
          .then(assertPass(done));
      });

      var types = {
        string: 'abc',
        number: 123,
        bool: false,
        object: {}
      };

      for (var name in types) {
        var shouldPass = opts.checkType(types[name]);
        var assert = shouldPass ? assertPass : assertFail;

        it(`Should ${shouldPass ? 'resolve' : 'reject'} for ${name}`, function (done) {
          return schema
            .validate(types[name])
            .then(onResolve, onReject)
            .then(assert(done));
        });
      }
    });
  });
});
