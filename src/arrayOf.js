import array from './types/array.js';

export default function arrayOf (schema, expectations = {}) {
  const arraySchema = array(expectations);

  return function (AST) {
    const arrayResult = arraySchema(AST);

    if (arrayResult.errors) {
      return arrayResult;
    }

    if (!AST.fields) {
      return arrayResult;
    }

    let errors = [];

    AST.fields.forEach(fieldAST => {
      const fieldResult = schema(fieldAST);

      if (fieldResult.errors) {
        errors = [...errors, ...fieldResult.errors];
      }
    });

    return errors.length
      ? { result: AST.value, errors }
      : { result: AST.value };
  };
}
