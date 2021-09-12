import { IdentityManager } from '../../shared/infrastructure/utils/IdentityManager';
import { Song } from '../domain/Song';
import { SongList } from '../domain/SongList';
import { UserSongListsRepository } from '../domain/UserSongListsRepository';
import inMemoryUsersSongListsRepository from '../infrastructure/repositories/InMemoryUserSongListsRepository';

class CreateSongListUseCase {
  constructor(
    private usersSongListsRepository: UserSongListsRepository,
    private identityManager: IdentityManager
  ) {}

  async execute(userId: string, songs: Song[]): Promise<SongList> {
    const songList: SongList = { listId: this.identityManager.next(), songs };

    await this.usersSongListsRepository.persist(userId, songList);

    return songList;
  }
}

export default new CreateSongListUseCase(inMemoryUsersSongListsRepository, new IdentityManager());

export { CreateSongListUseCase };
