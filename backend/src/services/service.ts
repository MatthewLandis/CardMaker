import 'dotenv/config';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { db } from '../db.js';
import { ICard } from '../models/cardModel.js';
import { HttpError } from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';

const scrypt = promisify(scryptCallback) as (password: string, salt: string, keylen: number) => Promise<Buffer>;

// The card columns in the same order as cardValues() below.
const cardColumns = [
    'title', 'title_style', 'template', 'pendulum_template', 'level', 'rank', 'n_level', 'attribute',
    'primary_type', 'core_type', 'ability_type', 'last_type', 'effect_text', 'pendulum_effect_text',
    'pendulum_scale', 'link_rating', 'atk', 'def', 'link_arrows', 'image_url', 'card_art_url',
];

function cardValues(cardData: ICard) {
    return [
        cardData.title,
        cardData.title_style,
        cardData.template,
        cardData.pendulum_template,
        cardData.level,
        cardData.rank,
        cardData.n_level,
        cardData.attribute,
        cardData.primary_type,
        cardData.core_type,
        cardData.ability_type,
        cardData.last_type,
        cardData.effect_text,
        cardData.pendulum_effect_text,
        cardData.pendulum_scale,
        cardData.link_rating,
        cardData.atk,
        cardData.def,
        JSON.stringify(cardData.link_arrows), // stored as JSONB
        cardData.image_url,
        cardData.card_art_url,
    ];
}

function parseCardId(id: string): number {
    const cardId = Number(id);
    if (!Number.isInteger(cardId) || cardId <= 0) {
        throw new HttpError(400, 'Invalid card id');
    }
    return cardId;
}

// Creates a new card, or updates the existing one when the card already has an id.
// Returns the id of the saved card so the frontend can keep editing the same card.
export async function saveCard(cardData: ICard, username: string): Promise<number> {
    const values = cardValues(cardData);

    if (cardData.id) {
        const assignments = cardColumns.map((column, i) => `${column} = $${i + 1}`).join(', ');
        const updated = await db.oneOrNone<{ id: number }>(
            `UPDATE cards SET ${assignments} WHERE id = $${values.length + 1} AND username = $${values.length + 2} RETURNING id`,
            [...values, cardData.id, username],
        );
        if (!updated) { throw new HttpError(404, 'Card not found'); }
        return updated.id;
    }

    const placeholders = cardColumns.map((_, i) => `$${i + 1}`).join(', ');
    const inserted = await db.one<{ id: number }>(
        `INSERT INTO cards (${cardColumns.join(', ')}, username) VALUES (${placeholders}, $${values.length + 1}) RETURNING id`,
        [...values, username],
    );
    return inserted.id;
};

export async function deleteCard(id: string, username: string) {
    // Only the owner of a card may delete it
    const result = await db.result('DELETE FROM cards WHERE id = $1 AND username = $2', [parseCardId(id), username]);

    if (result.rowCount !== 1) { throw new HttpError(404, 'Card not found'); }
};

export async function getCards(username: string) {
    // db.any<ICard> returns any number of rows, so cards is of type ICard[]
    return db.any<ICard>('SELECT * FROM cards WHERE username = $1 ORDER BY id', [username]);
};

export async function getCardById(id: string, username: string) {
    // db.oneOrNone<ICard> returns either one card or null. Only the owner of a card may view it.
    const card = await db.oneOrNone<ICard>('SELECT * FROM cards WHERE id = $1 AND username = $2', [parseCardId(id), username]);

    if (!card) { throw new HttpError(404, 'Card not found'); }

    return card;
};

// Passwords are stored as "scrypt$<salt>$<hash>" so the real password is never saved.
async function hashPassword(password: string) {
    const salt = randomBytes(16).toString('base64');
    const hash = await scrypt(password, salt, 32);
    return `scrypt$${salt}$${hash.toString('base64')}`;
}

async function verifyPassword(password: string, stored: string) {
    const [scheme, salt, hash] = stored.split('$');
    if (scheme !== 'scrypt' || !salt || !hash) { return false; }
    const expected = Buffer.from(hash, 'base64');
    const actual = await scrypt(password, salt, expected.length);
    return timingSafeEqual(actual, expected);
}

function validateCredentials(username: unknown, password: unknown): asserts username is string {
    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
        throw new HttpError(400, 'Username and password are required');
    }
}

function createToken(username: string) {
    // Creates a jwt that includes the username in the payload
    return jwt.sign({ username }, process.env['JWT_TOKEN']!, { expiresIn: '30d' });
}

export async function register(username: string, password: string) {
    validateCredentials(username, password);
    username = username.trim();

    // A duplicate username makes Postgres throw a unique violation, which errorHandler turns into a 409
    await db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [username, await hashPassword(password)]);

    return createToken(username);
};

export async function login(username: string, password: string) {
    validateCredentials(username, password);
    username = username.trim();

    const user = await db.oneOrNone<{ password: string }>('SELECT password FROM users WHERE username = $1', [username]);
    if (!user) { throw new HttpError(401, 'Wrong username or password'); }

    if (!(await verifyPassword(password, user.password))) {
        // Accounts created before passwords were hashed still hold the plain password.
        // If it matches, upgrade it to a hash so it is never stored in plain text again.
        if (user.password !== password) { throw new HttpError(401, 'Wrong username or password'); }
        await db.none('UPDATE users SET password = $1 WHERE username = $2', [await hashPassword(password), username]);
    }

    return createToken(username);
};
