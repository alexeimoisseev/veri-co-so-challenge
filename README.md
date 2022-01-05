# The task

The task should be delivered to you by email or other channel as a link to our Notion page.

# Boilerplate information

This is a simple Typescript boilerplate for your task.
To run the development server, simply use `npm run dev`.
The only source file - `src/index.ts` serves as the entrypoint and contains
examples of how to connect to the database, do http requests, or set up a http server.
We recommend certain libraries which we describe in the source code, but you can use whatever you want.

We recommend running postgres in Docker. Just use `docker compose up` to spin up the database container
defined in `docker-compose.yml`.


# Helpful links

- The unauthenticated StackExchange API limit should be sufficient but if you want to experiment more,
  you can register your app and increase the limit from 300 to 1000 per day. Useful links:
  - https://stackapps.com/questions/67/how-api-keys-work-faq
  - https://stackapps.com/questions/9181/how-can-i-get-the-access-token-to-use-the-stackoverflow-rest-api-as-an-authentic
  - https://stackapps.com/apps/oauth/register
  - https://stackapps.com/apps/oauth/
