DROP DATABASE IF EXISTS express_starter_app;
CREATE DATABASE express_starter_app;

\c express_starter_app;

CREATE TABLE IF NOT EXISTS users(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    username TEXT,
    name TEXT -- holds name from FB, Twitter or Google token
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    FaceBookToken TEXT, -- holds facebook token
    TwitterToken TEXT, -- holds twitter token
    GoogleToken TEXT, -- holds google token
    jwtToken TEXT -- holds jwt token
);