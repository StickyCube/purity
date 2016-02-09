'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Custom type checking', function () {
  var schema = null;
  var opts = {
    aliases: ['Alias_3'],
    check: function (v) { return typeof v === 'string' || typeof v === 'number'; }
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
