import { Router } from 'express';
import createSongList from '../controllers/createSongList';
import getSongLists from '../controllers/getSongLists';

const routes = Router();

routes.get('/:userId/lists', getSongLists);
routes.post('/:userId/lists', createSongList);

export default routes;
