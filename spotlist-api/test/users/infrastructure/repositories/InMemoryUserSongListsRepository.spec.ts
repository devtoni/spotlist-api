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

  test('Should return a requested song list of a user', async () => {
    const userId = '123456';
    const listId = '123';
    const repository = new InMemoryUserSongListsRepository();
    await repository.persist(userId, createFakeSongList('123'));

    const response = await repository.findById(userId, listId);

    expect(response).toEqual({ listId: '123', songs: [] });
  });

  test(`Should return null in case a requested song list is not found in a given user`, async () => {
    const userId = '123456';
    const listId = '123';
    const repository = new InMemoryUserSongListsRepository();

    const response = await repository.findById(userId, listId);

    expect(response).toEqual(null);
  });

  test('Should persist a song for a given listId of an user', async () => {
    const userId = '123456';
    const listId = '12';
    const song = { title: 'a song', artist: 'an artist' };
    const repository = new InMemoryUserSongListsRepository();
    await repository.persist(userId, createFakeSongList('12'));

    await repository.persistSongByListId(userId, listId, song);
    const response = await repository.find(userId);

    expect(response).toHaveLength(1);
    expect(response).toEqual(
      expect.arrayContaining([{ listId: '12', songs: [{ artist: 'an artist', title: 'a song' }] }])
    );
  });
});

const createFakeSongList = (id: string) => {
  return {
    listId: id,
    songs: []
  };
};
