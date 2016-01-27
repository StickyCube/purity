'use strict';

let expect = require('chai').expect;
let sandbox = require('sinon').sandbox.create();

let Schema = require('../../../src/purity').Schema;

describe('Using callback api', function () {
  let schema = null;

  beforeEach(function () {
    schema = new Schema({
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
