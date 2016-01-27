'use strict';

let expect = require('chai').expect;
let utils = require('../../src/utils');
let Schema = require('../../src/schema');

describe('utils', function () {
  describe('isSchema', function () {
    let schema = new Schema({ $type: Number });

    it('Should only return true for a schema instance', function () {
      expect(utils.isSchema(123)).to.be.false;
      expect(utils.isSchema(null)).to.be.false;
      expect(utils.isSchema(undefined)).to.be.false;
      expect(utils.isSchema('abc')).to.be.false;
      expect(utils.isSchema(true)).to.be.false;
      expect(utils.isSchema({})).to.be.false;
      expect(utils.isSchema(schema)).to.be.true;
    });
  });

  describe('isArray', function () {
    it('Should only return true for an array instance', function () {
      expect(utils.isArray(123)).to.be.false;
      expect(utils.isArray(null)).to.be.false;
      expect(utils.isArray(undefined)).to.be.false;
      expect(utils.isArray('abc')).to.be.false;
      expect(utils.isArray(true)).to.be.false;
      expect(utils.isArray({})).to.be.false;
      expect(utils.isArray([])).to.be.true;
    });
  });

  describe('isNan', function () {
    it('Should only return false for a number', function () {
      expect(utils.isNan(123)).to.be.false;
      expect(utils.isNan(null)).to.be.true;
      expect(utils.isNan(undefined)).to.be.true;
      expect(utils.isNan('abc')).to.be.true;
      expect(utils.isNan(true)).to.be.true;
      expect(utils.isNan({})).to.be.true;
      expect(utils.isNan([])).to.be.true;
    });
  });

  describe('isEndpoint', function () {
    it('Should only return true if the object has the $type key', function () {
      expect(utils.isEndpoint('string')).to.be.false;
      expect(utils.isEndpoint({})).to.be.false;
      expect(utils.isEndpoint({ string: { $type: 'string' } })).to.be.false;
      expect(utils.isEndpoint({ $type: 'string' })).to.be.true;
    });
  });

  describe('isPlainObject', function () {
    it('Should only return true for an instance of Object', function () {
      expect(utils.isPlainObject(123)).to.be.false;
      expect(utils.isPlainObject(null)).to.be.false;
      expect(utils.isPlainObject(undefined)).to.be.false;
      expect(utils.isPlainObject('abc')).to.be.false;
      expect(utils.isPlainObject(false)).to.be.false;
      expect(utils.isPlainObject({})).to.be.true;
      expect(utils.isPlainObject([])).to.be.false;
    });
  });
});
