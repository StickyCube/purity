'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Basic nested arrays', function () {
  var schema = null;

  before(function () {
    schema = purity.Schema([{
      foo: {
        bar: [Number],
        baz: [{ fizz: { $type: String } }]
      }
    }]);
  });

  it('Should validate correctly', function (done) {
    let data = [{
      foo: {
        bar: [123],
        baz: [{ fizz: 'abc' }]
      }
    }, {
      foo: {
        bar: [1, 2],
        baz: [{ fizz: 'a' }, { fizz: 'b' }]
      }
    }, {
      foo: {
        bar: [1, 2, 3],
        baz: [{ fizz: 'a' }, { fizz: 'b' }, { fizz: 'c' }]
      }
    }];
    schema.validate(data, function (e, r) {
      // console.log(e, r);
      expect(e).to.be.null;
      expect(r).to.eql(data);
      done();
    });
  });
});
