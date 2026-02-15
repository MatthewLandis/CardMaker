import 'dotenv/config';
import { db } from './db.js';
import { ICard } from './model.js';

export const getCards = async () => {
    const cards = await db.any<ICard>(
        `
        SELECT *
        FROM cards
    `);

    return cards;
};

export const saveCard = async (cardData: ICard) => {
    await db.none(
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
    card_art_url
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
    $21  -- card_art_url
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
        cardData.card_art_url
    ]);

    return;
};

export const deleteCard = async (id: string) => {
    await db.none(
        'DELETE FROM cards WHERE id = $1',
        [id]
    );
};

export const getCardById = async (id: string) => {
    const card = await db.oneOrNone<ICard>(
        `
        SELECT *
        FROM cards
        WHERE ID = $1
    `, [id]);

    if (!card) {
        throw new Error('Card not found');
    }

    return card;
};