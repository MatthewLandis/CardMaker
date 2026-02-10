import { Router } from 'express';
import { getCards } from './controller.js';

export const routes = Router();

routes.get('/cards', getCards);
