// TODO: use knex.js. Or... some ORM? Nah...
import { PostgresDb } from 'fastify-postgres';

export function deleteWordsForQuestion(sql: PostgresDb, question_id: number) {
  const deleteQuery = `DELETE FROM words WHERE question_id = $1`;
  return sql.query(deleteQuery, [ question_id ]);
}

export function addWord(sql: PostgresDb, word: string, question_id: number, answered: boolean) {
    const addWordQuery = `INSERT INTO WORDS (
    word,
    question_id,
    answered
  ) VALUES ($1, $2, $3)`;

  return sql.query(addWordQuery, [
    word,
    question_id,
    answered,
  ]);
}

export function getStats(sql: PostgresDb) {
  const query = `SELECT
    word,
    COUNT(1) AS total,
    SUM(CASE WHEN answered THEN 1 ELSE 0 END) AS answered
  FROM words
  GROUP BY word`;

  return sql.query(query);
}
