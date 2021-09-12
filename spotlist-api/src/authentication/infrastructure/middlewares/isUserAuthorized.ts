import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../../../shared/infrastructure/errors/UnauthorizedError';
import loginUseCase from '../../application/LoginUseCase';

export default async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
  const { authorization } = request.headers;

  if (!authorization) {
    return next(new UnauthorizedError('User is not the one authenticated'));
  }

  const [, base64EncodedCredentials] = authorization.split('Basic ');

  if (!base64EncodedCredentials) {
    return next(new UnauthorizedError('User is not the one authenticated'));
  }

  const credentials = Buffer.from(base64EncodedCredentials, 'base64').toString();
  const credentialsSeparator = ':';
  const [username, password] = credentials.split(credentialsSeparator);

  try {
    await loginUseCase.execute(username, password);
  } catch (error) {
    if (error.message.includes('User not found')) {
      return next(new UnauthorizedError('User not found'));
    }
    return next(error);
  }

  return next();
};
