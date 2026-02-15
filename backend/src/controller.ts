import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';
import { ICard } from './model.js';

export const getCards = async (req: Request, res: Response<ICard[]>, next: NextFunction) => {
    try {
        const cards: ICard[] = await service.getCards();

        res.status(200).json(cards);
    } catch (error) {
        next(error);
    }
};

export const saveCard = async (req: Request<ICard>, res: Response, next: NextFunction) => {
    try {
        const cardData: ICard = req.body;
        await service.saveCard(cardData);

        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

export const deleteCard = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const cardId: string = req.params.id;
        await service.deleteCard(cardId);

        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

export const getCardById = async (req: Request<{ id: string }>, res: Response<ICard>, next: NextFunction) => {
    try {
        const cardId: string = req.params.id;
        const card: ICard = await service.getCardById(cardId);

        res.status(200).json(card);
    } catch (error) {
        next(error);
    }
};