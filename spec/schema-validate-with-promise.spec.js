'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Validate using promise API', function () {
  var schema = null;

  before(function () {
    schema = purity.Schema(String);
  });

  it('Should resolve when valid', function () {
    schema.validate('123abc')
      .then(
        function (r) {
          expect(r).to.eql('123abc');
        },
        function (e) {
          throw e;
        }
      );
  });

  it('Should reject when invalid', function () {
    schema.validate(123)
      .then(
        function (r) {
          throw new Error('Fail');
        },
        function (e) {
          expect(e).not.to.be.null;
        }
      );
  });
});
