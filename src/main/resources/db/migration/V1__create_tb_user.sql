CREATE TYPE role_enum AS ENUM ('ROLE_USER', 'ROLE_ADMIN');

CREATE TABLE tb_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role role_enum NOT NULL
);
