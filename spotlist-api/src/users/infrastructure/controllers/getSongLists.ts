import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../../../shared/infrastructure/errors/BadRequest';
import UnauthorizedError from '../../../shared/infrastructure/errors/UnauthorizedError';
import getSongListsUseCase from '../../application/GetSongListsUseCase';

export default async (request: Request, response: Response, next: NextFunction) => {
  const { userId } = request.params;

  if (userId !== response.locals.userId) {
    return next(new UnauthorizedError('User is not the one authenticated'));
  }

  try {
    const songLists = await getSongListsUseCase.execute(userId);

    return response.json(songLists);
  } catch (error) {
    if (error.message.includes('Song lists not found')) {
      return next(new BadRequestError('Invalid parameters'));
    }
    return next(error);
  }
};
