import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../../../shared/infrastructure/errors/BadRequest';
import UnauthorizedError from '../../../shared/infrastructure/errors/UnauthorizedError';
import getSongListByIdUseCase from '../../application/GetSongListByIdUseCase';

export default async (request: Request, response: Response, next: NextFunction) => {
  const { userId, listId } = request.params;

  if (userId !== response.locals.userId) {
    return next(new UnauthorizedError('User is not the one authenticated'));
  }

  try {
    const songList = await getSongListByIdUseCase.execute(userId, listId);

    return response.json(songList);
  } catch (error) {
    if (error.message.includes('Song list not found')) {
      return next(new BadRequestError('Invalid parameters'));
    }
    return next(error);
  }
};
