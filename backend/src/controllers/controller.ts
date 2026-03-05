import { Request, Response, NextFunction } from 'express';
import * as service from '../services/service.js';
import { ICard } from '../models/CardModel.js';
import { IAuth } from '../models/authModels.js';

export async function getCards(req: Request, res: Response<ICard[]>, next: NextFunction) {
    try {
        const cards: ICard[] = await service.getCards(req.username);
        res.status(200).json(cards);
    } catch (error) {
        next(error);
    }
};

export async function saveCard(req: Request<unknown, unknown, ICard>, res: Response, next: NextFunction) {
    try {
        const cardData: ICard = req.body;
        await service.saveCard(cardData, req.username);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

export async function deleteCard(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const cardId: string = req.params.id;
        await service.deleteCard(cardId);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

export async function getCardById(req: Request<{ id: string }>, res: Response<ICard>, next: NextFunction) {
    try {
        const cardId: string = req.params.id;
        const card: ICard = await service.getCardById(cardId);
        res.status(200).json(card);
    } catch (error) {
        next(error);
    }
};

export async function register(req: Request<IAuth>, res: Response<string>, next: NextFunction) {
    try {
        const token: string = await service.register(req.body.username, req.body.password);
        res.status(200).json(token);
    } catch (error) {
        next(error);
    }
};

export async function login(req: Request<IAuth>, res: Response<string>, next: NextFunction) {
    try {
        const token: string = await service.login(req.body.username, req.body.password);
        res.status(200).json(token);
    } catch (error) {
        next(error);
    }
};