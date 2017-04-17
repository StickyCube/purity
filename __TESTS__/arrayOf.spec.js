import test from 'ava';
import validate, {arrayOf, string} from '../src/index.js';

test('No options - nil value', async t => {
  const schema = arrayOf(string());
  const data = undefined;

  try {
    let result = await validate(schema, data);
    t.is(result, undefined);
  } catch (error) {
    t.fail(error.message);
  }
});

test('No options - empty array', async t => {
  const schema = arrayOf(string());
  const data = [];

  try {
    let result = await validate(schema, data);
    t.deepEqual(result, []);
  } catch (error) {
    t.fail(error.message);
  }
});

test('No options - array of strings', async t => {
  const schema = arrayOf(string());
  const data = ['a', 'b', 'c'];

  try {
    let result = await validate(schema, data);
    t.deepEqual(result, ['a', 'b', 'c']);
  } catch (error) {
    t.fail(error.message);
  }
});

test('No options - array with invalid element', async t => {
  const schema = arrayOf(string());
  const data = ['a', 1, 'c'];

  try {
    await validate(schema, data);
    t.fail('Expected an error');
  } catch (error) {
    console.log(error.errors);
    t.is(error.errors[0].valueInfo.path, '1');
  }
});
