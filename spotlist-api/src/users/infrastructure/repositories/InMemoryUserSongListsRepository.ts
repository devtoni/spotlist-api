import { Song } from '../../domain/Song';
import { SongList } from '../../domain/SongList';
import { UserSongListsRepository } from '../../domain/UserSongListsRepository';

type Resource = { [userId: string]: SongList[] };

class InMemoryUserSongListsRepository implements UserSongListsRepository {
  private userSongListsDb: Resource = {};

  async find(userId: string): Promise<SongList[] | null> {
    const userSongLists = this.userSongListsDb[userId];

    return userSongLists || null;
  }

  async findById(userId: string, songListId: string): Promise<SongList | null> {
    const userSongLists = this.userSongListsDb[userId];

    if (!userSongLists) {
      return null;
    }

    return userSongLists.find((userSongList) => userSongList.listId === songListId) || null;
  }

  async persist(userId: string, songList: SongList): Promise<void> {
    const userSongLists = this.userSongListsDb[userId];

    if (!userSongLists) {
      this.userSongListsDb[userId] = [songList];
    } else {
      userSongLists.push(songList);
    }
  }

  async persistSongByListId(userId: string, listId: string, song: Song): Promise<void> {
    const userSongLists = this.userSongListsDb[userId];

    const songList = userSongLists.find((songList) => songList.listId === listId) as SongList;

    songList.songs.push(song);
  }
}

export default new InMemoryUserSongListsRepository();

export { InMemoryUserSongListsRepository };
