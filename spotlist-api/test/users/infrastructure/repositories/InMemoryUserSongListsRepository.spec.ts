import { InMemoryUserSongListsRepository } from '../../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository';

describe('InMemoryUserSongListsRepository', () => {
  test('Should return the song lists of a given user', async () => {
    const userId = '123456';
    const repository = new InMemoryUserSongListsRepository();
    await repository.persist(userId, createFakeSongList('12'));

    const response = await repository.find(userId);

    expect(response).toEqual([{ listId: '12', songs: [] }]);
  });

  test(`Should return null in case there aren't song lists for a given user yet`, async () => {
    const userId = '123456';
    const repository = new InMemoryUserSongListsRepository();

    const response = await repository.find(userId);

    expect(response).toEqual(null);
  });

  test('Should persist a song list for a non existent user song lists resource', async () => {
    const userId = '123456';
    const repository = new InMemoryUserSongListsRepository();

    await repository.persist(userId, createFakeSongList('13'));
    const response = await repository.find(userId);

    expect(response).toEqual([{ listId: '13', songs: [] }]);
  });

  test('Should persist a song list for an existent user song lists resource', async () => {
    const userId = '123456';
    const repository = new InMemoryUserSongListsRepository();
    await repository.persist(userId, createFakeSongList('12'));

    await repository.persist(userId, createFakeSongList('13'));
    const response = await repository.find(userId);

    expect(response).toHaveLength(2);
    expect(response).toEqual(expect.arrayContaining([{ listId: '13', songs: [] }]));
  });
});

const createFakeSongList = (id: string) => {
  return {
    listId: id,
    songs: []
  };
};
