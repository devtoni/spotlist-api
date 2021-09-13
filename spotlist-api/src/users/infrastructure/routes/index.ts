import { Router } from 'express';
import createSongList from '../controllers/createSongList';
import getSongListById from '../controllers/getSongListById';
import getSongLists from '../controllers/getSongLists';

const routes = Router();

routes.get('/:userId/lists', getSongLists);
routes.post('/:userId/lists', createSongList);
routes.get('/:userId/lists/:listId', getSongListById);

export default routes;
