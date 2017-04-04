import CustomError from 'custom-error';

export const Types = {
  NIL: 'NIL',
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT'
};

export const Errors = {
  RequiredFieldError: 'RequiredFieldError',
  TypeMismatchError: 'TypeMismatchError',
  OutOfBoundsError: 'OutOfBoundsError',
  InvalidValueError: 'InvalidValueError'
};

export const ValidationError = CustomError('Purity::ValidationError');
