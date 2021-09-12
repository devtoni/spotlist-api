import { GetSongListsUseCase } from '../../../src/users/application/GetSongListsUseCase';
import { InMemoryUserSongListsRepository } from '../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository';

describe('GetSongListsUseCase', () => {
  test('Should return the song lists of a given user', async () => {
    const userId = '123456';
    const repository = new InMemoryUserSongListsRepository();
    const getUserSongListUseCase = new GetSongListsUseCase(repository);
    await repository.persist(userId, createFakeSongList('12'));

    const response = await getUserSongListUseCase.execute(userId);

    expect(response).toEqual([{ listId: '12', songs: [] }]);
  });

  test(`Should return null in case there aren't song lists for a given user yet`, async () => {
    const userId = '123456';
    const repository = new InMemoryUserSongListsRepository();
    const getUserSongListUseCase = new GetSongListsUseCase(repository);

    const response = await getUserSongListUseCase.execute(userId);

    expect(response).toEqual(null);
  });
});

const createFakeSongList = (id: string) => {
  return {
    listId: id,
    songs: []
  };
};
