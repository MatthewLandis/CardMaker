import 'dotenv/config';
import { db } from '../db.js';
import { ICard } from '../models/CardModel.js';
import jwt from 'jsonwebtoken';

export async function saveCard(cardData: ICard, username: string) {
    // Djas: db.none here previously indicated that nothing needs to be returned from the query.
    // I'm changing it to db.result so that I can see the number of rows affected, and then throw an error if no rows were affected.
    var queryResult = await db.result(
    `
INSERT INTO cards (
    title,
    title_style,
    template,
    pendulum_template,
    level,
    rank,
    n_level,
    attribute,
    primary_type,
    core_type,
    ability_type,
    last_type,
    effect_text,
    pendulum_effect_text,
    pendulum_scale,
    link_rating,
    atk,
    def,
    link_arrows,
    image_url,
    card_art_url,
    username
)
VALUES (
    $1,  -- title
    $2,  -- title_style
    $3,  -- template
    $4,  -- pendulum_template
    $5,  -- level
    $6,  -- rank
    $7,  -- n_level
    $8,  -- attribute
    $9,  -- primary_type
    $10, -- core_type
    $11, -- ability_type
    $12, -- last_type
    $13, -- effect_text
    $14, -- pendulum_effect_text
    $15, -- pendulum_scale
    $16, -- link_rating
    $17, -- atk
    $18, -- def
    $19, -- link_arrows (JSONB)
    $20, -- image_url
    $21,  -- card_art_url,
    $22 -- username
)

    `, [
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
        JSON.stringify(cardData.link_arrows),
        cardData.image_url,
        cardData.card_art_url,
        username
    ]);

    if (queryResult.rowCount !== 1) {
        throw new Error('An error occured while inserting the card');
    }

    return;
};

export async function deleteCard(id: string) {
    await db.none('DELETE FROM cards WHERE id = $1', [id]); // Runs the query in the database and does not store its result in any way.
};

export async function getCards(username: string) {
    // Runs the query in the database and stores the result into the variable cards
    // db.any<ICard> below indicates that the query should return any amount of ICard fitting objects. Therefore the variable cards is of type ICard[]
    const cards = await db.any<ICard>(`SELECT * FROM cards WHERE username = $1`, [username]);

    return cards;  // Returns the cards back to the controller
};

export async function getCardById(id: string) {
    // Runs the query in the database and stores the result into the variable card
    // db.oneOrNone<ICard> below indicates that the query should return either one card or no card. Therefore, the variable card is of type ICard | null
    const card = await db.oneOrNone<ICard>(`SELECT * FROM cards WHERE ID = $1`, [id]);

    if (!card) { throw new Error('Card not found'); } // If no card is returned from the query, throw an error

    return card; // Returns the card back to the controller
};

export async function register(username: string, password: string) {
    // Runs the query in the database and stores the result into the variable result
    // db.result below indicates that the query should return some data pertaining to the result of the query execution. This is primarily to see how many rows were affected by the INSERT
    const result = await db.result(`INSERT INTO users (username, password) VALUES ($1, $2);`, [username, password]);

    if (result.rowCount != 1) { throw new Error("Stupid freak! :D") } // If the did not insert 1 row, throw an error.

    const token: string = jwt.sign({ username: username }, process.env['JWT_TOKEN']!, { expiresIn: '30d' }); // Creates a jwt that includes the username in the payload
    return token; // Returns the token to the controller
};

export async function login(username: string, password: string) {
    const result = await db.result(`SELECT * FROM users WHERE username = $1 AND password = $2;`, [username, password]);

    if (result.rowCount != 1) { throw new Error("you got the wrong stuff :D") }

    const token: string = jwt.sign({ username: username }, process.env['JWT_TOKEN']!, { expiresIn: '30d' });
    
    return token;
};