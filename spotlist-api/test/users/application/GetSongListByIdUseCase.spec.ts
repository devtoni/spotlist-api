import { GetSongListByIdUseCase } from '../../../src/users/application/GetSongListByIdUseCase';
import { InMemoryUserSongListsRepository } from '../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository';

describe('GetSongListByIdUseCase', () => {
  test('Should return the song list of a given user', async () => {
    const request = { userId: '123456', listId: '123' };
    const repository = new InMemoryUserSongListsRepository();
    const getSongListByIdUseCase = new GetSongListByIdUseCase(repository);
    await repository.persist(request.userId, createFakeSongList(request.listId));

    const response = await getSongListByIdUseCase.execute(request.userId, request.listId);

    expect(response).toEqual({ listId: '123', songs: [] });
  });

  test(`Should throw error in case a requested song list does not exist for a given user`, async () => {
    const request = { userId: '123456', listId: '123' };
    const repository = new InMemoryUserSongListsRepository();
    const getSongListByIdUseCase = new GetSongListByIdUseCase(repository);

    await expect(
      getSongListByIdUseCase.execute(request.userId, request.listId)
    ).rejects.toThrowError(new Error('Song list not found'));
  });
});

const createFakeSongList = (id: string) => {
  return {
    listId: id,
    songs: []
  };
};
