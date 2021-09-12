import express, { Request, Response } from 'express';
import isUserAuthorized from './authentication/infrastructure/middlewares/isUserAuthorized';
import errorHandler from './shared/infrastructure/middlewares/errorHandler';
import userRoutes from './users/infrastructure/routes';

const app = express();

app.use(express.json());

app.use('/users', isUserAuthorized, userRoutes);

app.use(errorHandler);

export default app;
