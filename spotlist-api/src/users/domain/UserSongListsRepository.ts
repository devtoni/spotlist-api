import { Song } from './Song';
import { SongList } from './SongList';

interface UserSongListsRepository {
  find(userId: string): Promise<SongList[] | null>;

  findById(userId: string, songListId: string): Promise<SongList | null>;

  persist(userId: string, songList: SongList): Promise<void>;

  persistSongByListId(userId: string, listId: string, song: Song): Promise<void>;
}

export { UserSongListsRepository };
