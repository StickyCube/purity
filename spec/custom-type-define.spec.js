'use strict';

var expect = require('chai').expect;
var purity = require('../src/purity');

describe('Defining a data type', function () {
  describe('API', function () {
    it('Should expose a module on the root export', function () {
      expect(purity.createDataType).to.be.defined;
    });
  });

  describe('When a type is defined with no aliases option', function () {
    it('Should throw', function () {
      expect(function () {
        purity.createDataType({});
      }).to.throw();
    });
  });

  describe('When a type is defined empty aliases option', function () {
    it('Should throw', function () {
      expect(function () {
        purity.createDataType({ aliases: [] });
      }).to.throw();
    });
  });

  describe('When a type with an alias which is already in use is defined', function () {
    it('Should throw', function () {
      expect(function () {
        purity.createDataType({ aliases: ['Alias_1'] });
        purity.createDataType({ aliases: ['Alias_1'] });
      }).to.throw();
    });
  });
});
