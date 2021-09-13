import { SongList } from '../domain/SongList';
import { UserSongListsRepository } from '../domain/UserSongListsRepository';
import inMemoryUsersSongListsRepository from '../infrastructure/repositories/InMemoryUserSongListsRepository';

class GetSongListByIdUseCase {
  constructor(private userSongListsRepository: UserSongListsRepository) {}

  async execute(userId: string, songListId: string): Promise<SongList | null> {
    const songList = await this.userSongListsRepository.findById(userId, songListId);

    if (!songList) {
      throw new Error('Song list not found');
    }
    return songList;
  }
}

export default new GetSongListByIdUseCase(inMemoryUsersSongListsRepository);

export { GetSongListByIdUseCase };
