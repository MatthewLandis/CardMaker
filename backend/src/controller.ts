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
