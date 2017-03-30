import CustomError from 'custom-error';

export const Types = {
  NIL: Symbol('NIL'),
  STRING: Symbol('STRING'),
  NUMBER: Symbol('NUMBER'),
  BOOLEAN: Symbol('BOOLEAN'),
  ARRAY: Symbol('ARRAY'),
  OBJECT: Symbol('OBJECT')
};

export const ErrorReasons = {
  VALUE_REQUIRED: 'Value required',
  TYPE_MISMATCH: 'Type mismatch',
  OUT_OF_RANGE: 'Value out of range'
};

export const ValidationError = CustomError('Purity::ValidationError');
