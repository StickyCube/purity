import test from 'ava';
import validate, {enumeration, Errors} from '../src/index.js';

test('No options', async t => {
  const schema = enumeration();

  try {
    await validate(schema, 'something');
    t.fail('Expected an Error');
  } catch (error) {
    t.is(error.errors[0].name, Errors.InvalidValueError);
  }
});

test('values option - empty array', async t => {
  const schema = enumeration({ values: [] });

  try {
    await validate(schema, 'something');
    t.fail('Expected an Error');
  } catch (error) {
    t.is(error.errors[0].name, Errors.InvalidValueError);
  }
});

test('values option - valid value', async t => {
  const schema = enumeration({ values: ['abc', 1, true] });

  try {
    let result = await validate(schema, 1);
    t.is(result, 1);
  } catch (error) {
    t.fail(error.message);
  }
});

test('values option - invalid value', async t => {
  const schema = enumeration({ values: ['this', 'or-that'] });

  try {
    await validate(schema, 'not-this');
    t.fail('Expected an Error');
  } catch (error) {
    t.is(error.errors[0].name, Errors.InvalidValueError);
  }
});
