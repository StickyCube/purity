'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var purity = require('../../src/purity');

var onResolve = sinon.stub();
var onReject = sinon.stub();

describe('Defining a transform', function () {
  var schema = null;

  beforeEach(function () {
    onResolve.reset();
    onReject.reset();
  });

  describe('API', function () {
    it('Should expose a module on the root export', function () {
      expect(purity.createTransform).to.be.defined;
    });
  });

  describe('Creating a transform with no restrictions', function () {
    before(function () {
      purity.createTransform('$test1', {
        transform: function (v, opt) {
          return v + ' ' + opt;
        }
      });
    });

    before(function () {
      schema = purity.Schema({ $type: String, $transform: ['$test1:bar'] });
    });

    it('Should apply the transform', function (done) {
      schema
        .validate('foo')
        // .then(v => console.log(v), e => console.log(e))
        .then(onResolve, onReject)
        .then(function () {
          expect(onReject.called).to.be.false;
          expect(onResolve.called).to.be.true;
          expect(onResolve.firstCall.args).to.eql(['foo bar']);
          done();
        });
    });
  });

  describe('Creating a transform with restrictions', function () {
    before(function () {
      purity.createTransform('$test2', {
        restrict: [Number],
        transform: function (v, opt) {
          return v + ' ' + opt;
        }
      });
    });

    before(function () {
      schema = purity.Schema({ $type: String, $transform: ['$test2:bar'] });
    });

    it('Should not apply the transform', function (done) {
      schema
        .validate('foo')
        .then(onResolve, onReject)
        .then(function () {
          expect(onReject.called).to.be.false;
          expect(onResolve.called).to.be.true;
          expect(onResolve.firstCall.args).to.eql(['foo']);
          done();
        });
    });
  });
});
