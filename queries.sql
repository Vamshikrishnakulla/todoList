--Database creation.
CREATE DATABASE "TodoDB";

--table creation.
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);

--records insertion.
INSERT INTO items (title) VALUES ('Buy milk'), ('Finish homework');