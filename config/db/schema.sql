DROP DATABASE IF EXISTS express_starter_app;
CREATE DATABASE express_starter_app;

\c express_starter_app;

CREATE TABLE IF NOT EXISTS users(
    id NUMERIC PRIMARY KEY NOT NULL,
    username VARCHAR(30),
    name VARCHAR(50), -- holds name from FB, Twitter or Google
    password VARCHAR(100),
    email VARCHAR(50) NOT NULL,
    oauthtoken TEXT, -- holds facebook, twitter, or google token
    jwttoken TEXT NOT NULL, -- holds jwt token
    registered_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session(
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;