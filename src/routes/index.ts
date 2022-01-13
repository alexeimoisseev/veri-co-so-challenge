import got from 'got';
import { FastifyInstance } from 'fastify';
import { PostgresDb } from 'fastify-postgres';
import qs from 'querystring';

import SOResponse from '../types/SOResponse';
import Question from '../types/Question';
import StatsItem from '../types/StatsItem';

import { addWord, deleteWordsForQuestion, getStats } from '../db';

function extractWords(item: Question): string[] {
  const words = item.title
    .match(/[\w]{4,}/g);
  if (!words) {
    return [];
  }

  // we pick only unique words lower case
  return [...new Set(words.map(t => t.toLowerCase()))];
}

async function saveWords(item: Question, sql: PostgresDb) {
  const words = extractWords(item);

  await deleteWordsForQuestion(sql, item.question_id);

  return Promise.all(words.map(
    word => addWord(sql, word, item.question_id, item.answer_count > 0)
  ));
}

async function formatStats(sql: PostgresDb, k: number = 0): Promise<StatsItem[]> {
  const result = await getStats(sql);
  if (!result || !result.rows) {
    return [];
  }
  const items = result.rows.map((item: any[]) => {
    const { word } = item;
    const total = Number(item.total);
    const answered = Number(item.answered);
    return {
      word,
      total,
      answered,
      ratio: Math.max(0, total - k) * (1 / Math.max(total-k, 1)) * (answered / total)
    };
  });
  return items.sort((a: StatsItem, b: StatsItem) => b.ratio - a.ratio);
}


interface LoadQueryString {
  from?: number;
  to?: number;
  tags?: string;
};

interface StatsQueryString {
  k: number;
};

function formatQuery(query: LoadQueryString): string {
  return qs.stringify({
    fromdate: query.from,
    todate: query.to,
    tags: query.tags,
  });
}

export default async function routes(fastify: FastifyInstance) {
  fastify.post<{
    Querystring: LoadQueryString,
  }>('/load', async (request, reply) => {
    const query = formatQuery(request.query);
    const url = `https://api.stackexchange.com/2.3/questions?order=asc&sort=creation&site=stackoverflow&${query}`;
    fastify.log.info({ url });
    const response = await got.get(url).json() as SOResponse;
    const { items } = response;

    // not cool. Promise.all of Promise.all
    // If one request fails, the whole thing will fail.
    // In real life this part should be done in some more smart way.
    // Like putting each question to some distributed queue and then saving one by one.
    // https://bit.ly/3qcZeDl
    await Promise.all(items.map(item => saveWords(item, fastify.pg)));

    return { result: 'ok' };
  });

  fastify.get<{
    Querystring: StatsQueryString
  }>('/stats', async (request, reply) => {
    const { k = 0 } = request.query;
    return await formatStats(fastify.pg, Number(k));
  });
}
