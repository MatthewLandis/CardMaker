import { Request, Response, NextFunction } from 'express';
import * as service from '../services/service.js';
import { ICard } from '../models/cardModel.js';
import { IAuth } from '../models/authModel.js';

export async function getCards(req: Request, res: Response<ICard[]>, next: NextFunction) {
    try {
        const cards: ICard[] = await service.getCards(req.username); // Passes only the username from the request into the service function and stores the return of the service function into the variable cards
        res.status(200).json(cards); // Sends back an OK response with the cards in the response body
    } catch (error) {
        next(error);
    }
};

export async function saveCard(req: Request<unknown, unknown, ICard>, res: Response, next: NextFunction) {
    try {
        const cardData: ICard = req.body; // Stores the value of the request body, which should be of type ICard, into the variable cardData
        await service.saveCard(cardData, req.username); // Passes the cardData and the username from the request into the service function. The service function does not return anything
        res.status(200).end(); // Sends back an OK response with nothing in the response body
    } catch (error) {
        next(error);
    }
};

export async function deleteCard(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const cardId: string = req.params.id; // Stores the value of the id from the request params into the variable cardId
        await service.deleteCard(cardId); // Passes the cardId into the service function. The service function does not return anything
        res.status(200).end(); // Sends back an OK response with nothing in the response body
    } catch (error) {
        next(error);
    }
};

export async function getCardById(req: Request<{ id: string }>, res: Response<ICard>, next: NextFunction) {
    try {
        const cardId: string = req.params.id; // Stores the value of the id from the request params into the variable cardId
        const card: ICard = await service.getCardById(cardId); // Passes the cardId into the service function and stores the return of the service function into the variable card
        res.status(200).json(card); // Sends back an OK response with the card in the response body
    } catch (error) {
        next(error);
    }
};

export async function register(req: Request<unknown, unknown, IAuth>, res: Response<string>, next: NextFunction) {
    try {
        const token: string = await service.register(req.body.username, req.body.password); // Passes the username and password provided in the request body into the service function and stores the return of the service function into the variable token
        res.status(200).json(token); // Sends back an OK response with the token in the response body
    } catch (error) {
        next(error);
    }
};

export async function login(req: Request<unknown, unknown, IAuth>, res: Response<string>, next: NextFunction) {
    try {
        const token: string = await service.login(req.body.username, req.body.password); // Passes the username and password provided in the request body into the service function and stores the return of the service function into the variable token
        res.status(200).json(token); // Sends back an OK response with the token in the response body
    } catch (error) {
        next(error);
    }
};