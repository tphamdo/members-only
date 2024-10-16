import { Client } from 'pg';

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) NOT NULL,
  hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  member BOOLEAN NOT NULL DEFAULT false,
  admin BOOLEAN NOT NULL DEFAULT false);

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message VARCHAR(255) NOT NULL,
    fromUserId INTEGER NOT NULL,
    added TIMESTAMP NOT NULL
  );
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error('Expected to recieve 1 argument <database_connection_url>');
    return -1;
  }

  const client = new Client({
    connectionString: args[0],
  });

  try {
    await client.connect();
    const result = await client.query(SQL);
    console.debug(result);
  } catch (error) {
    throw Error('Could not init users table: ' + error);
  } finally {
    await client.end();
  }
}

main();
