import pool from './pool';

export async function addUser(user: {
  username: string;
  hash: string;
  salt: string;
}) {
  const SQL = `
    INSERT INTO users (username, hash, salt)
    VALUES ($1, $2, $3);
  `;

  await pool.query(SQL, [user.username, user.hash, user.salt]);
}

export async function getUser(username: string) {
  const SQL = `
    SELECT * FROM users
    WHERE users.username = $1
  `;

  const { rows } = await pool.query(SQL, [username]);
  if (rows.length > 1)
    console.error(
      `Found more than one user with the same username: ${rows[0]}`,
    );
  return rows.length ? rows[0] : undefined;
}

export async function getUserById(userId: number) {
  const SQL = `
    SELECT * FROM users
    WHERE users.id = $1
  `;

  const { rows } = await pool.query(SQL, [userId]);
  if (rows.length > 1)
    console.error(
      `Found more than one user with the same username: ${rows[0]}`,
    );
  return rows.length ? rows[0] : undefined;
}
