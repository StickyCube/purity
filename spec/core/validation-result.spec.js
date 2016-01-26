'use strict';

let expect = require('chai').expect;
let ValidationResult = require('../../src/validation-result');

let actual;
let expected;

beforeEach(function () {
  actual = expected = undefined;
});

describe('Sanity checks', function () {
  let validationResult = null;

  describe('When no options provided', function () {
    beforeEach(function () {
      validationResult = new ValidationResult();
    });

    it('Should use default for value - undefined', function () {
      expect(validationResult.value).to.be.undefined;
    });

    it('Should use default for path - ""', function () {
      expect(validationResult.path).to.equal('');
    });

    it('Should use default for index - null', function () {
      expect(validationResult.index).to.be.null;
    });
  });

  describe('When options provided', function () {
    beforeEach(function () {
      validationResult = new ValidationResult({ index: 0, path: 'foo', value: 123 });
    });

    it('Should use the provided option for value', function () {
      expect(validationResult.value).to.equal(123);
    });

    it('Should use the provided option for path', function () {
      expect(validationResult.path).to.equal('foo');
    });

    it('Should use the provided option for index', function () {
      expect(validationResult.index).to.equal(0);
    });
  });
});

describe('inflateObject', function () {
  let results;

  it('Should return the value when only one result is present and no path is set', function () {
    results = [new ValidationResult({ value: 12345 })];

    actual = ValidationResult.inflateObject(results);
    expected = 12345;

    expect(actual).to.equal(expected);
  });

  it('Should set the property of an object when a path is specified', function () {
    results = [new ValidationResult({ path: 'foo', value: 'bar' })];

    actual = ValidationResult.inflateObject(results);
    expected = { foo: 'bar' };

    expect(actual).to.deep.equal(expected);
  });

  it('Should work for nested objects', function () {
    results = [new ValidationResult({ path: 'foo.bar.fizz', value: 12345 })];

    actual = ValidationResult.inflateObject(results);
    expected = { foo: { bar: { fizz: 12345 } } };

    expect(actual).to.deep.equal(expected);
  });

  it('Should set all specified properties', function () {
    results = [
      new ValidationResult({ path: 'foo', value: 'one' }),
      new ValidationResult({ path: 'bar', value: 'two' }),
      new ValidationResult({ path: 'baz', value: 'three' })
    ];

    actual = ValidationResult.inflateObject(results);
    expected = { foo: 'one', bar: 'two', baz: 'three' };

    expect(actual).to.deep.equal(expected);
  });
});

describe('inflateArray', function () {
  let results;

  it('Should correctly inflate an array of primitives', function () {
    results = [
      new ValidationResult({ value: 1, index: 0 }),
      new ValidationResult({ value: 2, index: 1 }),
      new ValidationResult({ value: 3, index: 2 })
    ];

    actual = ValidationResult.inflateArray(results);
    expected = [1, 2, 3];

    expect(actual).to.deep.equal(expected);
  });

  it('Should inflate an array on objects which have 2 properties', function () {
    results = [
      new ValidationResult({ path: 'foo', value: 12, index: 0 }),
      new ValidationResult({ path: 'bar', value: 34, index: 0 }),
      new ValidationResult({ path: 'foo', value: 56, index: 1 }),
      new ValidationResult({ path: 'bar', value: 78, index: 1 })
    ];

    actual = ValidationResult.inflateArray(results);
    expected = [{ foo: 12, bar: 34 }, { foo: 56, bar: 78 }];

    expect(actual).to.deep.equal(expected);
  });
});
