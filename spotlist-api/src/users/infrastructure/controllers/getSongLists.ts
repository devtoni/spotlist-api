import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../../../shared/infrastructure/errors/BadRequest';
import getSongListsUseCase from '../../application/GetSongListsUseCase';

export default async (request: Request, response: Response, next: NextFunction) => {
  const { userId } = request.params;

  if (userId !== response.locals.userId) {
    return next(new BadRequestError('Invalid parameters'));
  }

  const songLists = await getSongListsUseCase.execute(userId);

  return response.json({ data: songLists });
};
