-- Creates the tables CardMaker needs. Run once against an empty database:
--   psql "postgres://postgres:yourpassword@localhost:5432/cardmaker" -f schema.sql

CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL -- scrypt hash, never the plain password
);

CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    title TEXT,
    title_style TEXT,
    template TEXT,
    pendulum_template BOOLEAN,
    level INT,
    rank INT,
    n_level INT,
    attribute TEXT,
    primary_type TEXT,
    core_type TEXT,
    ability_type TEXT,
    last_type TEXT,
    effect_text TEXT,
    pendulum_effect_text TEXT,
    pendulum_scale INT,
    link_rating INT,
    atk INT,
    def INT,
    link_arrows JSONB,
    image_url TEXT,    -- the rendered card as a base64 image
    card_art_url TEXT  -- the uploaded art as a base64 image
);

CREATE INDEX IF NOT EXISTS cards_username_idx ON cards (username);
