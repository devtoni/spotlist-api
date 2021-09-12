import { StatusCodes } from 'http-status-codes';
import { HttpError } from './HttpError';

export default class UnauthorizedError extends HttpError {
  message: string;
  status: number = StatusCodes.UNAUTHORIZED;

  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);

    this.message = message;
  }
}
