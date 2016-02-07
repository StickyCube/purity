'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('validate nested objects', function () {
  var schema = null;

  before(function () {
    schema = purity.Schema({
      foo: {
        deeper: {
          nested: { $type: Boolean }
        }
      },
      bar: Number
    });
  });

  it('Should pass when valid data is given', function (done) {
    schema.validate({ foo: { deeper: { nested: true } } }, function (e, r) {
      expect(e).to.be.null;
      done();
    });
  });
});
