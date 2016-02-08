'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Simple transform', function () {
  var schema = null;
  var transform = function (v) {
    return v.split('_');
  };

  before(function () {
    schema = purity.Schema({ $type: String, $transform: transform });
  });

  it('Should transform the data', function () {
    schema.validate('a_b_c_d', function (e, r) {
      expect(e).to.be.null;
      expect(r).to.eql(['a', 'b', 'c', 'd']);
    });
  });
});
