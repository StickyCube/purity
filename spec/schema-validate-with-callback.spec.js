'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Using callback api', function () {
  var schema = null;

  beforeEach(function () {
    schema = purity.Schema({
      foo: Number,
      bar: String
    });
  });

  it('Should pass a validation error to the first arg', function (done) {
    schema.validate({ foo: 123, bar: 456 }, function (err, res) {
      expect(err).not.to.be.null;
      expect(res).to.be.undefined;
      done();
    });
  });

  it('Should pass the result to the second arg', function (done) {
    schema.validate({ foo: 123, bar: 'abc' }, function (err, res) {
      expect(err).to.be.null;
      expect(res).to.eql({ foo: 123, bar: 'abc' });
      done();
    });
  });
});
