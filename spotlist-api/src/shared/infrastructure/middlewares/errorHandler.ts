import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/HttpError';

export default (
  error: Error | HttpError,
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof HttpError) {
    if (error.status >= 500) {
      console.error({ ...error, stack: error.stack });
    }
    return response.status(error.status).json(error.message);
  }

  console.error({ ...error, stack: error.stack });
  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Something went wrong');
};
