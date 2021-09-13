import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../../../shared/infrastructure/errors/BadRequest';
import getSongListByIdUseCase from '../../application/GetSongListByIdUseCase';

export default async (request: Request, response: Response, next: NextFunction) => {
  const { userId, listId } = request.params;

  if (userId !== response.locals.userId) {
    return next(new BadRequestError('Invalid parameters'));
  }

  const songList = await getSongListByIdUseCase.execute(userId, listId);

  return response.json({ data: songList });
};
