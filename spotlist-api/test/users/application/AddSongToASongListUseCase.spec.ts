import { AddSongToASongListUseCase } from '../../../src/users/application/AddSongToASongListUseCase';
import { InMemoryUserSongListsRepository } from '../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository';

describe('AddSongToASongListUseCase', () => {
  test('Should create and return a new song for a given userId and listId', async () => {
    const request = { userId: '123456', listId: '1234', song:{ title: 'a song', artist: 'an artist' }};
    const repository = new InMemoryUserSongListsRepository();
    const addSongToASongListUseCase = new AddSongToASongListUseCase(repository);

    await repository.persist(request.userId, createFakeSongList(request.listId));
    const response = await addSongToASongListUseCase.execute(request.userId, request.listId, request.song);

    expect(response).toEqual(request.song);
  });

  test('Should throw in case the given listId is not found for that userId', async () => {
    const request = { userId: '123456', listId: '1234', song:{ title: 'a song', artist: 'an artist' }};
    const repository = new InMemoryUserSongListsRepository();
    const addSongToASongListUseCase = new AddSongToASongListUseCase(repository);

    await expect(addSongToASongListUseCase.execute(request.userId, request.listId, request.song)).rejects.toThrow(
      new Error('Song list not found')
    );
  });
});

const createFakeSongList = (id: string) => {
  return {
    listId: id,
    songs: []
  };
};
