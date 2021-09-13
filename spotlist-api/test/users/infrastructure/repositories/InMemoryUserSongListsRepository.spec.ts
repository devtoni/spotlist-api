import { InMemoryUserSongListsRepository } from '../../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository';

describe('InMemoryUserSongListsRepository', () => {
  test('Should return the song lists of a given user', async () => {
    const userId = '123456';
    const listId = '12';
    const repository = new InMemoryUserSongListsRepository();
    await repository.persist(userId, createFakeSongList(listId));

    const response = await repository.find(userId);

    expect(response).toEqual([{ listId, songs: [] }]);
  });

  test(`Should return null in case there aren't song lists for a given user yet`, async () => {
    const userId = '123456';
    const repository = new InMemoryUserSongListsRepository();

    const response = await repository.find(userId);

    expect(response).toEqual(null);
  });

  test('Should persist a song list for a non existent user song lists resource', async () => {
    const userId = '123456';
    const listId = '13';
    const repository = new InMemoryUserSongListsRepository();

    await repository.persist(userId, createFakeSongList(listId));
    const response = await repository.find(userId);

    expect(response).toEqual([{ listId, songs: [] }]);
  });

  test('Should persist a song list for an existent user song lists resource', async () => {
    const userId = '123456';
    const listId1 = '12';
    const listId2 = '13';
    const repository = new InMemoryUserSongListsRepository();
    await repository.persist(userId, createFakeSongList(listId1));

    await repository.persist(userId, createFakeSongList(listId2));
    const response = await repository.find(userId);

    expect(response).toHaveLength(2);
    expect(response).toEqual(expect.arrayContaining([{ listId: listId2, songs: [] }]));
  });

  test('Should return a requested song list of a user', async () => {
    const userId = '123456';
    const listId = '123';
    const repository = new InMemoryUserSongListsRepository();
    await repository.persist(userId, createFakeSongList(listId));

    const response = await repository.findById(userId, listId);

    expect(response).toEqual({ listId, songs: [] });
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
    await repository.persist(userId, createFakeSongList(listId));

    await repository.persistSongByListId(userId, listId, song);
    const response = await repository.find(userId);

    expect(response).toHaveLength(1);
    expect(response).toEqual(expect.arrayContaining([{ listId: listId, songs: [song] }]));
  });
});

const createFakeSongList = (id: string) => {
  return {
    listId: id,
    songs: []
  };
};
