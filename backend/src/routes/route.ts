import { Router } from 'express';
import { authorize } from '../middleware/authorize.js';
import { getCards, saveCard, deleteCard, getCardById, register, login } from '../controllers/controller.js';

export const routes = Router();

routes.get('/cards', authorize, getCards);
routes.post('/save', authorize, saveCard);
routes.delete('/cards/:id', authorize, deleteCard);
routes.get('/card/:id', authorize, getCardById);
routes.post('/register', register);
routes.post('/login', login);

