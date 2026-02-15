import { Router } from 'express';
import { getCards, saveCard, deleteCard, getCardById } from './controller.js';

export const routes = Router();

routes.get('/cards', getCards);
routes.post('/save', saveCard);
routes.delete('/cards/:id', deleteCard);
routes.get('/card/:id', getCardById);