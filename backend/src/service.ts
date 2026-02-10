import 'dotenv/config';
import { db } from './db.js';
import { ICard } from './model.js';

export const getCards = async () => {
    const cards = await db.any<ICard>(
        `
        SELECT title, level
        FROM cards
    `);

    return cards;
};
