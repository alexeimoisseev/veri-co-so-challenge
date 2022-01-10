import { Connection } from 'postgresql-client';

const {
  PG_URL = 'postgres://devUser:devPassword@localhost:35432/db',
} = process.env;

async function run() {
  const sql = new Connection('postgres://devUser:devPassword@localhost:35432/db');
  await sql.connect();

  await sql.query(
    `CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      question_id INTEGER UNIQUE,
      title TEXT,
      answer_count INTEGER,
      creation_date TIMESTAMP
    )`
  );

  await sql.query(
    `CREATE TABLE IF NOT EXISTS words(
      word TEXT,
      question_id INTEGER,
      answered BOOLEAN
    )`
  );

  process.exit(0);
};

run();
