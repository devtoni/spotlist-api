import { SongList } from './SongList';

interface UserSongListsRepository {
  find(userId: string): Promise<SongList[] | null>;

  persist(userId: string, songList: SongList): Promise<void>;
}

export { UserSongListsRepository };