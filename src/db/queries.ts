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

  const existingUser = await getUser(user.username);
  if (existingUser) throw Error('That username already exists');

  const rows = await pool.query(SQL, [user.username, user.hash, user.salt]);
  console.log('AU:', rows);
  console.log('AU:', rows.rows);
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

export async function makeMember(userId: number) {
  const SQL = `
    UPDATE users
    SET member = true
    WHERE users.id = $1;
  `;

  await pool.query(SQL, [userId]);
}

export async function addMessage(userId: number, message: string) {
  const SQL = `
    INSERT INTO messages (fromUserId, message, added)
    VALUES ($1, $2, NOW());
  `;

  await pool.query(SQL, [userId, message]);
}
