import {Connection} from 'postgresql-client';
import fastify from 'fastify'
import got from 'got'

async function run() {
  // ----------- POSTGRESQL connection and usage
   
  const sql = new Connection('postgres://devUser:devPassword@localhost:35432/db')
  // Example usage of the SQL connection.
  await sql.connect();
  // Ensure some tables exist.
  await sql.query(`CREATE TABLE IF NOT EXISTS exampleTable (n integer, s text)`);

  // Insert some data.
  await sql.query(`INSERT INTO exampleTable (n, s) VALUES ($1, 'one')`, {params: [Math.round(Math.random() * 10000)]});

  // Query the data.
  const {rows} = await sql.query(`SELECT * FROM exampleTable`)
  console.log('current rows:', rows)
  await sql.close();

  // ----------- StackOverflow requests example
  // We recommend using the awesome http client library `got`

  const { data } = await got.get('https://api.stackexchange.com/2.3/info?site=stackoverflow', {
    // json: { // You can include some body in post requests like this
    //   hello: 'world'
    // }
  }).json();
  console.log('Request result:', data)

  // ----------- HTTP server example
  // You will also want to create some http server. We recommend you look into:
  // https://www.fastify.io/

  const server = fastify({ logger: { prettyPrint: true }, })

  // Declare a route
  server.get('/', async (request, reply) => {
    console.log(request.params) // To get the params
    return { hello: 'world' }
  })

  server.post('/', async (request, reply) => {
    console.log(request.body) // To get the body
    return { hello: 'world' }
  })

  try {
    await server.listen(3000)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

run()
