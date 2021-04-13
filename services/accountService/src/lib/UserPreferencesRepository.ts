const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@ec2-18-204-101-137.compute-1.amazonaws.com:5432/d46idgb6list1r',
  ssl: {
    rejectUnauthorized: false,
  },
});

export interface UserInfo {
  user_id: string;
  email?: string;
  username?: string;
  use_audio?: boolean;
  use_video?: boolean;
  JoinedTowns?: TownInfo[];
}
export interface TownInfo {
  user_id: string;
  map_id: string;
  x_pos: number;
  y_pos: number;
}

/**
 * checks if a user already exists, if so, updates their account, otherwise creates a new user
 * RETURN type: {success: true/false}
 */
export async function upsertUser(userInfo: UserInfo): Promise<boolean> {
  const user_id = userInfo.user_id;

  const userIdQuery = await client.query(
    `SELECT user_id FROM user_preferences WHERE user_id='${user_id}';`,
  );

  if (user_id === userIdQuery) {
    const query = {
      name: 'update-user',
      text:
        'UPDATE user_preferences SET email=ISNULL($1, email), username=ISNULL($2, username), use_audio=ISNULL($3, use_audio), use_video=ISNULL($4, use_video) WHERE user_id = $5',
      values: [userInfo.email, userInfo.username, userInfo.use_audio, userInfo.use_video],
    };

    await client.query(query).then((err: any) => {
      if (err) {
        return false;
      }
    });
  } else {
    const query = {
      name: 'insert-user',
      text:
        'INSERT INTO user_preferences (user_id, username, email, use_audio, use_video) VALUES ($1, $2, $3, $4, $5)',
      values: [user_id, userInfo.username, userInfo.email, userInfo.use_audio, userInfo.use_video],
    };

    await client.query(query).then((err: any) => {
      if (err) {
        return false;
      }
    });
  }

  return upsertTowns(userInfo);
}

/**
 * checks if a town exists with a user already joined, if so, updates the town info, otherwise adds to the town info list
 * RETURN type: {success: true/false}
 */
export async function upsertTowns(userInfo: UserInfo): Promise<boolean> {
  const user_id = userInfo.user_id;
  const townArray = userInfo.JoinedTowns;

  const toInsert = new Array<TownInfo>();
  const toUpdate = new Array<TownInfo>();

  const townQuery = {
    name: 'get-town',
    text: 'SELECT $1, $2, $3, $4, $5 from towns WHERE user_id=$6',
    values: ['user_id', 'server_id', 'map_id', 'x_pos', 'y_pos', user_id],
  };

  await client.query(townQuery, (err: any, res: any) => {
    if (err) {
      console.error(err);
      return;
    }
    for (let row of res.rows) {
      let townInfo: TownInfo = {
        user_id: row.user_id,
        server_id: row.server_id,
        map_id: row.map_id,
        x_pos: row.x_pos,
        y_pos: row.y_pos,
      };
      toUpdate.push(townInfo);
    }
  });

  townArray?.forEach(town => {
    if (!toUpdate.includes(town)) {
      toInsert.push(town);
    }
  });

  if (toInsert !== undefined && toInsert.length !== 0) {
    toInsert.forEach(town => {
      const query = {
        name: 'insert-table',
        text:
          'INSERT INTO towns (user_id, server_id, map_id, x_pos, y_pos) VALUES ($1, $2, $3, $4, $5)',
        values: [user_id, town.server_id, town.map_id, town.x_pos, town.y_pos],
      };

      client.query(query).then((err: any) => {
        if (err) {
          return false;
        }
      });
    });
  }

  if (toUpdate !== undefined && toUpdate.length !== 0) {
    toInsert.forEach(town => {
      const query = {
        name: 'update-table',
        text:
          'UPDATE towns SET server_id=ISNULL($1, server_id), map_id=ISNULL($2, map_id), x_pos=ISNULL($3, x_pos), y_pos=ISNULL($4, y_pos) WHERE user_id = $5',
        values: [town.server_id, town.map_id, town.x_pos, town.y_pos, user_id],
      };

      client.query(query).then((err: any) => {
        if (err) {
          return false;
        }
      });
    });
  }

  return true;
}

/**
 * gets user info given a user_id
 * RETURN type: AccountTypes.User interface
 */
export async function getUserByID(user_id: string): Promise<UserInfo> {
  const townArray = new Array<TownInfo>();
  let userInfo: UserInfo = { user_id: ' ' };

  await client
    .query(`SELECT * FROM towns WHERE user_id = '${user_id}';`)
    .then((res: { rows: any }) => {
      for (let row of res.rows) {
        let townInfo: TownInfo = {
          user_id: row.user_id,
          server_id: row.server_id,
          map_id: row.map_id,
          x_pos: row.x_pos,
          y_pos: row.y_pos,
        };
        townArray.push(townInfo);
      }
    });

  await client
    .query(`SELECT * FROM user_preferences where user_id = '${user_id}';`)
    .then((res: { rows: any }) => {
      userInfo = {
        user_id: res.rows[0].user_id,
        email: res.rows[0].email,
        username: res.rows[0].username,
        use_audio: res.rows[0].use_audio,
        use_video: res.rows[0].use_video,
        JoinedTowns: [],
      };
    });

  return userInfo;
}

/**
 * deletes a user, specified by their email
 * RETURN type: {success: true/false}
 */
export async function deleteUser(user_id: string): Promise<boolean> {
  try {
    await client.query(`DELETE FROM user_preferences WHERE user_id = '${user_id}';`);
    await client.query(`DELETE FROM towns WHERE user_id = '${user_id}';`);

    return true;
  } catch {
    return false;
  }
}
