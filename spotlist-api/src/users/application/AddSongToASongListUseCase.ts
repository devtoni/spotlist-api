import { Song } from '../domain/Song';
import { UserSongListsRepository } from '../domain/UserSongListsRepository';
import inMemoryUsersSongListsRepository from '../infrastructure/repositories/InMemoryUserSongListsRepository';

class AddSongToASongListUseCase {
  constructor(private usersSongListsRepository: UserSongListsRepository) {}

  async execute(userId: string, listId: string, song: Song): Promise<Song> {
    const songList = await this.usersSongListsRepository.findById(userId, listId);

    if (!songList) {
      throw new Error('Song list not found');
    }

    await this.usersSongListsRepository.persistSongByListId(userId, listId, song);

    return song;
  }
}

export default new AddSongToASongListUseCase(inMemoryUsersSongListsRepository);

export { AddSongToASongListUseCase };
