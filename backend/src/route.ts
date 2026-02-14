import { Router } from 'express';
import { getCards, saveCard } from './controller.js';
import { deleteCard } from './service.js';

export const routes = Router();

routes.get('/cards', getCards);
routes.post('/save', saveCard);
routes.delete('/cards/:id', deleteCard);