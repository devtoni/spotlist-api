import { GetSongListsUseCase } from '../../../src/users/application/GetSongListsUseCase';
import { InMemoryUserSongListsRepository } from '../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository';

describe('GetSongListsUseCase', () => {
  test('Should return the song lists of a given user', async () => {
    const request = { userId: '123456' };
    const listId = '12';
    const repository = new InMemoryUserSongListsRepository();
    const getSongListsUseCase = new GetSongListsUseCase(repository);
    await repository.persist(request.userId, createFakeSongList(listId));

    const response = await getSongListsUseCase.execute(request.userId);

    expect(response).toEqual([{ listId: '12', songs: [] }]);
  });

  test(`Should throw error in case there aren't song lists for a given user yet`, async () => {
    const request = { userId: '123456' };
    const repository = new InMemoryUserSongListsRepository();
    const getSongListsUseCase = new GetSongListsUseCase(repository);

    await expect(getSongListsUseCase.execute(request.userId)).rejects.toThrowError(
      new Error('Song lists not found')
    );
  });
});

const createFakeSongList = (id: string) => {
  return {
    listId: id,
    songs: []
  };
};
