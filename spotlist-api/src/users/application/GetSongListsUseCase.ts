import { SongList } from '../domain/SongList';
import { UserSongListsRepository } from '../domain/UserSongListsRepository';
import inMemoryUsersSongListsRepository from '../infrastructure/repositories/InMemoryUserSongListsRepository';

class GetSongListsUseCase {
  constructor(private userSongListsRepository: UserSongListsRepository) {}

  async execute(userId: string): Promise<SongList[] | null> {
    const songLists = await this.userSongListsRepository.find(userId);

    return songLists;
  }
}

export default new GetSongListsUseCase(inMemoryUsersSongListsRepository);

export { GetSongListsUseCase };
