import test from 'ava';
import validate, {number, ErrorTypes} from '../src/index.js';

test('No options - invalid type', async t => {
  const schema = number();

  try {
    await validate(schema, 'abc');
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.Invalid);
  }
});

test('No options - valid type', async t => {
  const schema = number();

  try {
    let result = await validate(schema, 123);
    t.is(result, 123);
  } catch (error) {
    t.fail(error.message);
  }
});

test('gt option - valid', async t => {
  const schema = number({ gt: 100 });

  try {
    let result = await validate(schema, 123);
    t.is(result, 123);
  } catch (error) {
    t.fail(error.message);
  }
});

test('gt option - invalid', async t => {
  const schema = number({ gt: 100 });

  try {
    await validate(schema, 23);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.Invalid);
  }
});

test('gte option - valid', async t => {
  const schema = number({ gte: 100 });

  try {
    let result = await validate(schema, 100);
    t.is(result, 100);
  } catch (error) {
    t.fail(error.message);
  }
});

test('gte option - invalid', async t => {
  const schema = number({ gte: 100 });

  try {
    await validate(schema, 99);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.Invalid);
  }
});

test('lt option - valid', async t => {
  const schema = number({ lt: 100 });

  try {
    let result = await validate(schema, 99);
    t.is(result, 99);
  } catch (error) {
    t.fail(error.message);
  }
});

test('lt option - invalid', async t => {
  const schema = number({ lt: 100 });

  try {
    await validate(schema, 100);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.Invalid);
  }
});

test('lte option - valid', async t => {
  const schema = number({ lte: 100 });

  try {
    let result = await validate(schema, 100);
    t.is(result, 100);
  } catch (error) {
    t.fail(error.message);
  }
});

test('lte option - invalid', async t => {
  const schema = number({ lte: 100 });

  try {
    await validate(schema, 101);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.Invalid);
  }
});

test('match option - valid', async t => {
  const schema = number({ match: /[0-9]{2}/ });

  try {
    let result = await validate(schema, 99);
    t.is(result, 99);
  } catch (error) {
    t.fail(error.message);
  }
});

test('match option - invalid', async t => {
  const schema = number({ match: /[0-9]{2}/ });

  try {
    await validate(schema, 9);
    t.fail('Expected an error');
  } catch (error) {
    t.is(error.errors[0].name, ErrorTypes.Invalid);
  }
});
