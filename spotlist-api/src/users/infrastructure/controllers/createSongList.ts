import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../../../shared/infrastructure/errors/BadRequest';
import UnauthorizedError from '../../../shared/infrastructure/errors/UnauthorizedError';
import createSongListUseCase from '../../application/CreateSongListUseCase';
import { Song } from '../../domain/Song';

export default async (request: Request, response: Response, next: NextFunction) => {
  const { userId } = request.params;

  if (userId !== response.locals.userId) {
    return next(new UnauthorizedError('User is not the one authenticated'));
  }

  const { list } = request.body;

  if (!list) {
    return next(new BadRequestError('Invalid parameters'));
  }

  if (list.songs) {
    const areValidSongs = list.songs.every((song: Song) => song.artist && song.title);

    if (!areValidSongs) {
      return next(new BadRequestError('Invalid parameters'));
    }
  }

  const songList = await createSongListUseCase.execute(userId, list.songs);

  return response.json(songList);
};
