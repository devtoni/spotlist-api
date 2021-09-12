import { CreateSongListUseCase } from '../../../src/users/application/CreateSongListUseCase';
import { InMemoryUserSongListsRepository } from '../../../src/users/infrastructure/repositories/InMemoryUserSongListsRepository';

describe('CreateSongListUseCase', () => {
  test('Should create and return a new song list for a given user', async () => {
    const userId = '123456';
    const repository = new InMemoryUserSongListsRepository();
    const identityManager = { next: () => '1' };
    const fakeSongs = [
      { title: 'a song', artist: 'an artist ' },
      { title: 'another song', artist: 'another artist ' }
    ];
    const createSongListUseCase = new CreateSongListUseCase(repository, identityManager);

    const response = await createSongListUseCase.execute(userId, fakeSongs);

    expect(response).toEqual({
      listId: '1',
      songs: [
        { artist: 'an artist ', title: 'a song' },
        { artist: 'another artist ', title: 'another song' }
      ]
    });
  });
});
