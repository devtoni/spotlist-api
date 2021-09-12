import { StatusCodes } from 'http-status-codes';
import { HttpError } from './HttpError';

export default class BadRequestError extends HttpError {
  message: string;
  status: number = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);

    this.message = message;
  }
}
