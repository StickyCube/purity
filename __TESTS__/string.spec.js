import test from 'ava';
import validate, {string, ErrorTypes} from '../src/index.js';

test('No options - no value', async t => {
  const schema = string();

  try {
    const result = await validate(schema);
    t.is(result, undefined);
  } catch (error) {
    t.fail(error.message);
  }
});

test('No options - null value', async t => {
  const schema = string();

  try {
    const result = await validate(schema, null);
    t.is(result, null);
  } catch (error) {
    t.fail(error.message);
  }
});

test('No options - empty string', async t => {
  const schema = string();

  try {
    const result = await validate(schema, '');
    t.is(result, '');
  } catch (error) {
    t.fail(error.message);
  }
});

test('No options - wrong value type', async t => {
  const schema = string();

  try {
    await validate(schema, 12345);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.InvalidValue);
  }
});

test('No options - correct value type', async t => {
  const schema = string();

  try {
    const result = await validate(schema, 'abcd');
    t.is(result, 'abcd');
  } catch (error) {
    t.fail(error.message);
  }
});

test('Required option - no value', async t => {
  const schema = string({ required: true });

  try {
    await validate(schema);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.RequiredValue);
  }
});

test('Required option - null value', async t => {
  const schema = string({ required: true });

  try {
    await validate(schema, null);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.RequiredValue);
  }
});

test('Required option - wrong value type', async t => {
  const schema = string({ required: true });

  try {
    await validate(schema, true);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.InvalidValue);
  }
});

test('Required option - correct value type', async t => {
  const schema = string({ required: true });

  try {
    const result = await validate(schema, 'abcde');
    t.is(result, 'abcde');
  } catch (error) {
    t.fail(error.message);
  }
});

test('minlength option - too short', async t => {
  const schema = string({ minlength: 5 });

  try {
    await validate(schema, 'abc');
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.InvalidValue);
  }
});

test('minlength option - in range', async t => {
  const schema = string({ minlength: 5 });

  try {
    const result = await validate(schema, 'abcdef');
    t.is(result, 'abcdef');
  } catch (error) {
    t.fail(error.message);
  }
});

test('maxlength option - too long', async t => {
  const schema = string({ maxlength: 5 });

  try {
    await validate(schema, 'abcdef');
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.InvalidValue);
  }
});

test('maxlength option - in range', async t => {
  const schema = string({ maxlength: 5 });

  try {
    const result = await validate(schema, 'abc');
    t.is(result, 'abc');
  } catch (error) {
    t.fail(error.message);
  }
});
