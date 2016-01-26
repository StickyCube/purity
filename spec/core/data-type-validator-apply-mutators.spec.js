'use strict';

let expect = require('chai').expect;
let rewire = require('rewire');

let DataTypeValidator = null;
let Validator = null;
let validator = null;

let actual = null;
let expected = null;

let definition = {
  aliases: [String],
  checkType: v => typeof v === 'string',
  cast: v => String(v),
  mutators: {
    $test1: v => `x ${v} X`,
    $test2: v => `${v.toUpperCase()}`,
    $test3: v => `${v.toLowerCase()}`
  }
};

describe('#_applyMutators', function () {
  before(function () {
    DataTypeValidator = rewire('../../src/data-type-validator');
    Validator = DataTypeValidator.define('String', definition);
  });

  describe('When no mutators are specified', function () {
    beforeEach(function () {
      validator = new Validator({ $type: String });
    });

    it('Should return the input', function () {
      actual = validator._applyMutators('hello');
      expected = 'hello';
      expect(actual).to.eql(expected);
    });
  });

  describe('When a single mutator is specified', function () {
    beforeEach(function () {
      validator = new Validator({ $type: String, $test1: true });
    });

    it('Should return the modified input', function () {
      actual = validator._applyMutators('hello');
      expected = 'x hello X';
      expect(actual).to.eql(expected);
    });
  });

  describe('When a multiple mutators are specified', function () {
    beforeEach(function () {
      validator = new Validator({ $type: String, $test1: true, $test2: true });
    });

    it('Should return the modified input', function () {
      actual = validator._applyMutators('hello');
      expected = 'X HELLO X';
      expect(actual).to.eql(expected);
    });
  });
});
