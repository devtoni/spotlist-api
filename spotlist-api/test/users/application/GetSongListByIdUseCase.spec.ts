import { GetSongListByIdUseCase } from '../../../src/users/application/GetSongListByIdUseCase';
import { InMemoryUserSongListsRepository } from '../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository';

describe('GetSongListByIdUseCase', () => {
  test('Should return the song list of a given user', async () => {
    const userId = '123456';
    const listId = '123';
    const repository = new InMemoryUserSongListsRepository();
    const getSongListByIdUseCase = new GetSongListByIdUseCase(repository);
    await repository.persist(userId, createFakeSongList('123'));

    const response = await getSongListByIdUseCase.execute(userId, listId);

    expect(response).toEqual({ listId: '123', songs: [] });
  });

  test(`Should return null in case a requested song list does not exist for a given user`, async () => {
    const userId = '123456';
    const listId = '123';
    const repository = new InMemoryUserSongListsRepository();
    const getSongListByIdUseCase = new GetSongListByIdUseCase(repository);

    const response = await getSongListByIdUseCase.execute(userId, listId);

    expect(response).toEqual(null);
  });
});

const createFakeSongList = (id: string) => {
  return {
    listId: id,
    songs: []
  };
};
