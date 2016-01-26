'use strict';

let expect = require('chai').expect;
let rewire = require('rewire');

let DataTypeValidator = null;
let actual = null;
let expected = null;

beforeEach(function () {
  DataTypeValidator = rewire('../../src/data-type-validator');
});

describe('statics', function () {
  describe('_createClass', function () {
    let Validator = null;
    let validator = null;

    describe('Default options', function () {
      beforeEach(function () {
        Validator = DataTypeValidator._createClass({});
        validator = new Validator({ foo: 123 });
      });

      it('Should default the path to an empty string', function () {
        actual = validator.path;
        expected = '';
        expect(actual).to.eql(expected);
      });

      it('Should assign an empty object to assertions', function () {
        actual = validator.assertions;
        expected = {};
        expect(actual).to.eql(expected);
      });

      it('Should assign an empty object to mutators', function () {
        actual = validator.mutators;
        expected = {};
        expect(actual).to.eql(expected);
      });

      it('Should return true on #checkType', function () {
        actual = validator.checkType();
        expected = true;
        expect(actual).to.eql(expected);
      });

      it('Should use an identity function for #cast', function () {
        actual = validator.cast([1, 2, 3]);
        expected = [1, 2, 3];
        expect(actual).to.eql(expected);
      });
    });

    describe('With options', function () {
      beforeEach(function () {
        Validator = DataTypeValidator._createClass({
          assertions: { $length: 123 },
          mutators: { $tofixed: 456 },
          checkType: () => 'Hello',
          cast: () => 'World'
        });
        validator = new Validator({ foo: 123 }, 'foo.bar.baz');
      });

      it('Should use the given path', function () {
        actual = validator.path;
        expected = 'foo.bar.baz';
        expect(actual).to.eql(expected);
      });

      it('Should use the given assertions', function () {
        actual = validator.assertions;
        expected = { $length: 123 };
        expect(actual).to.eql(expected);
      });

      it('Should use the given mutators', function () {
        actual = validator.mutators;
        expected = { $tofixed: 456 };
        expect(actual).to.eql(expected);
      });

      it('Should use the given checkType function', function () {
        actual = validator.checkType();
        expected = 'Hello';
        expect(actual).to.eql(expected);
      });

      it('Should use the given cast function', function () {
        actual = validator.cast();
        expected = 'World';
        expect(actual).to.eql(expected);
      });
    });
  });

  describe('define', function () {
    it('Should throw when a type is defined with a reserved name', function () {
      expect(function () {
        DataTypeValidator.define('TestType', {});
        DataTypeValidator.define('TestType', {});
      }).to.throw();
    });

    it('Should create an id for the types in Types', function () {
      DataTypeValidator.define('TestType', {});
      expect(DataTypeValidator.Types.TestType).to.be.defined;
    });

    it('Should store the Validator against it\'s aliases', function () {
      DataTypeValidator.define('TestType', {});
      expect(DataTypeValidator._types.length).to.equal(2);
    });

    it('Should store against any additional aliases', function () {
      DataTypeValidator.define('TestType', { aliases: ['TestType123'] });
      expect(DataTypeValidator._types.length).to.equal(3);
    });

    it('Should throw if an alias is already in use', function () {
      expect(function () {
        DataTypeValidator.define('TestType', { aliases: ['TestType123'] });
        DataTypeValidator.define('TestType2', { aliases: ['TestType123'] });
      }).to.throw();
    });
  });

  describe('_getTypeWithAlias', function () {
    beforeEach(function () {
      DataTypeValidator.define('TestType', {});
    });

    it('Should retrieve the type by it\'s name', function () {
      actual = DataTypeValidator._getTypeWithAlias('TestType');
      expect(actual).not.to.be.null;
    });

    it('Should retreive the type by it\'s id', function () {
      actual = DataTypeValidator._getTypeWithAlias(DataTypeValidator.Types.TestType);
      expect(actual).not.to.be.null;
    });

    it('Should return null when an incorrect alias is given', function () {
      actual = DataTypeValidator._getTypeWithAlias('NotARealAlias');
      expect(actual).to.be.null;
    });
  });

  describe('create', function () {
    let TestType1;
    let TestType2;

    beforeEach(function () {
      TestType1 = DataTypeValidator.define('TestType1', {});
      TestType2 = DataTypeValidator.define('TestType2', {});
    });

    it('Should throw when the specified type is not defined', function () {
      expect(function () {
        DataTypeValidator.create({ $type: 'TestType3' }, {});
      }).to.throw();
    });

    it('Should retreive the type using object syntax', function () {
      actual = DataTypeValidator.create({ $type: 'TestType1' }, {});
      expect(actual instanceof TestType1).to.be.true;
    });

    it('Should retreive the type when not using object syntax', function () {
      actual = DataTypeValidator.create('TestType2', {});
      expect(actual instanceof TestType2).to.be.true;
    });
  });
});

describe('#_hasOption', function () {
  let validator;

  beforeEach(function () {
    validator = new DataTypeValidator({ $type: Number, $gt: 10, $lt: 20 });
  });

  it('Should return true when the option is present', function () {
    actual = validator._hasOption('$gt');
    expected = true;
    expect(actual).to.eql(expected);
  });

  it('Should return false when the option is present', function () {
    actual = validator._hasOption('$lte');
    expected = false;
    expect(actual).to.eql(expected);
  });
});

describe('#_option', function () {
  let validator;

  beforeEach(function () {
    validator = new DataTypeValidator({ $type: Number, $gt: 10, $lt: 20 });
  });

  it('Should return the value of the given option', function () {
    actual = validator._option('$gt');
    expected = 10;
    expect(actual).to.eql(expected);
  });
});

describe('#_getDefaultValue', function () {
  let validator;

  describe('When default is a static value', function () {
    beforeEach(function () {
      validator = new DataTypeValidator({ $type: Number, $default: 123 });
    });

    it('Should return that value', function () {
      actual = validator._getDefaultValue();
      expected = 123;
      expect(actual).to.eql(expected);
    });
  });

  describe('When default is a function', function () {
    beforeEach(function () {
      let val = () => 'Hello';
      validator = new DataTypeValidator({ $type: Number, $default: val });
    });

    it('Should return that value', function () {
      actual = validator._getDefaultValue();
      expected = 'Hello';
      expect(actual).to.eql(expected);
    });
  });
});
