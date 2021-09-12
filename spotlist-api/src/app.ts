import express, { Request, Response } from 'express';
import isUserAuthorized from './authentication/infrastructure/middlewares/isUserAuthorized';
import errorHandler from './shared/infrastructure/middlewares/errorHandler';

const app = express();

app.get('/', isUserAuthorized, (_req: Request, res: Response) => {
  res.json({ message: 'Hello' });
});

app.use(errorHandler);

export default app;
