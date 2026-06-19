import { ZodError } from 'zod';

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = Number.isInteger(err?.statusCode) ? err.statusCode : 500;
  let message = err.message || 'Something went wrong!';
  let error = err;

  if (err instanceof ZodError) {
    message = 'Validation Error';
    error = err.issues;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export default globalErrorHandler;