import { SongList } from '../../domain/SongList';
import { UserSongListsRepository } from '../../domain/UserSongListsRepository';

type Resource = { [userId: string]: SongList[] };

class InMemoryUserSongListsRepository implements UserSongListsRepository {
  private userSongListsDb: Resource = {};

  async find(userId: string): Promise<SongList[] | null> {
    const userSongLists = this.userSongListsDb[userId];

    return userSongLists || null;
  }

  async persist(userId: string, songList: SongList): Promise<void> {
    const userSongLists = this.userSongListsDb[userId];

    if (!userSongLists) {
      this.userSongListsDb[userId] = [songList];
    } else {
      userSongLists.push(songList);
    }
  }
}

export default new InMemoryUserSongListsRepository();

export { InMemoryUserSongListsRepository };