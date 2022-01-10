import { Connection } from 'postgresql-client';
import fastifyPostgres from 'fastify-postgres';
import fastify from 'fastify';
import got from 'got';

import routes from './routes';

const {
  PORT = 3000,
  PG_URL = 'postgres://devUser:devPassword@localhost:35432/db'
} = process.env;

async function run() {

  const server = fastify({ logger: { prettyPrint: true }, })

  server.register(fastifyPostgres, {
    connectionString: PG_URL,
  });

  server.register(routes);

  try {
    await server.listen(Number(PORT));
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

run();
