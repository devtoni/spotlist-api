import { Router } from 'express';
import createSongList from '../controllers/createSongList';
import getSongListById from '../controllers/getSongListById';
import getSongLists from '../controllers/getSongLists';
import addSongToASongList from '../controllers/addSongToASongList';

const routes = Router();

routes.get('/:userId/lists', getSongLists);
routes.post('/:userId/lists', createSongList);
routes.get('/:userId/lists/:listId', getSongListById);
routes.post('/:userId/lists/:listId/songs', addSongToASongList);

export default routes;
