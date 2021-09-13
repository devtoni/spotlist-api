import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../../../shared/infrastructure/errors/BadRequest';
import addSongToASongListUseCase from '../../application/AddSongToASongListUseCase';
import { Song } from '../../domain/Song';

export default async (request: Request, response: Response, next: NextFunction) => {
  const { userId, listId } = request.params;

  if (userId !== response.locals.userId) {
    return next(new BadRequestError('Invalid parameters'));
  }

  const { song } = request.body;

  if (!song) {
    return next(new BadRequestError('Invalid parameters'));
  }

  const isValidSong = (requestSong: Song) => requestSong.title && requestSong.artist;

  if (!isValidSong) {
    return next(new BadRequestError('Invalid parameters'));
  }

  try {
    const newSong = await addSongToASongListUseCase.execute(userId, listId, song);

    return response.json({ data: newSong });
  } catch (error) {
    if (error.message.includes('Song list not found')) {
      return next(new BadRequestError('Invalid parameters'));
    }
    return next(error);
  }
};
