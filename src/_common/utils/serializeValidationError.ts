import { ValidationError } from 'yup';
interface Error {
  path: string;
  message: string;
}

export const serializeValidationError = (err: ValidationError) => {
  const invalid: Error[] = [];
  debugger
  err.inner.map(value => {
    invalid.push({
      path: value.path,
      message: value.message,
    });
  });

  console.log({invalid})
  return invalid;
};
