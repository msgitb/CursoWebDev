CREATE TABLE
    users (
        id VARCHAR(30) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        color VARCHAR(20) NOT NULL DEFAULT 'black',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    todos (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(30),
        content VARCHAR(200) NOT NULL,
        done BOOLEAN NOT NULL DEFAULT FALSE,
        deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)
        REFERENCES users(id)
    )