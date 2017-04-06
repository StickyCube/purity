import CustomError from 'custom-error';

const ValidationError = CustomError('Purity::ValidationError');

export const ErrorTypes = {
  RequiredValue: 'RequiredValue',
  InvalidValue: 'InvalidValue'
};

export default ValidationError;
