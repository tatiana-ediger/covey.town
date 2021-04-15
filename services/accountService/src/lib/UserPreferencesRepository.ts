import { JoinedTown } from '../AccountTypes';

const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@ec2-18-204-101-137.compute-1.amazonaws.com:5432/d46idgb6list1r',
  ssl: {
    rejectUnauthorized: false,
  },
});

// makes a connection to the database and maintains it until the program ends
client.connect();

export type SavedUserInfoRequest = {
  userID: string;
  username?: string;
  email?: string;
  useAudio?: boolean;
  useVideo?: boolean;
  towns?: JoinedTown[];
};

/**
 * checks if a user already exists, if so, updates their account, otherwise creates a new user
 * RETURN type: {success: true/false}
 */
export async function upsertUser(userInfo: SavedUserInfoRequest): Promise<boolean> {
  try {
    const userPreferencesQuery = {
      name: 'UpsertUserPreferences',
      text: `INSERT INTO user_preferences AS up (user_id, email, username, use_audio, use_video)
            VALUES ($1, COALESCE($2, ''), COALESCE($3, ''), COALESCE($4, false), COALESCE($5, false))
            ON CONFLICT ON CONSTRAINT user_preferences_pkey
            DO
              UPDATE SET
                email = COALESCE($2, up.email),
                username = COALESCE($3, up.username),
                use_audio = COALESCE($4, up.use_audio),
                use_video = COALESCE($5, up.use_video)
              WHERE up.user_id = $1;`,
      values: [userInfo.userID, userInfo.email, userInfo.username, userInfo.useAudio, userInfo.useVideo],
    };

    await client.query(userPreferencesQuery);

    const townsQueries: any[] = [];
    userInfo.towns?.forEach(town => {
      const townsQuery = {
        name: 'UpsertTowns',
        text: `INSERT INTO towns AS t (user_id, town_id, position_x, position_y)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT ON CONSTRAINT uq_town
              DO
                UPDATE SET
                  position_x = $3,
                  position_y = $4
                WHERE t.user_id = $1 AND t.town_id = $2;`,
        values: [userInfo.userID, town.townID, town.positionX, town.positionY],
      };
      townsQueries.push(client.query(townsQuery));
    });

    Promise.all(townsQueries);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * gets user info given a user_id
 * RETURN type: AccountTypes.User interface
 */
export async function getUserByID(userID: string): Promise<SavedUserInfoRequest | undefined> {
  try {
    const query = {
      name: 'GetUserByID',
      text: `SELECT up.user_id,
                    up.email,
                    up.username,
                    up.use_audio,
                    up.use_video,
                    t.town_id,
                    t.position_x,
                    t.position_y
              FROM user_preferences up
              LEFT JOIN towns t ON up.user_id = t.user_id
              WHERE up.user_id = $1`,
      values: [userID],
    };

    let user: SavedUserInfoRequest | undefined;
    const response = await client.query(query);
    response.rows.forEach((row: any) => {
      if (user === undefined) {
        user = {
          userID: row.user_id,
          email: row.email,
          username: row.username,
          useAudio: row.use_audio,
          useVideo: row.use_video,
          towns: [],
        };
      }

      if (row.town_id) {
        user.towns?.push({
          townID: row.town_id,
          positionX: row.position_x,
          positionY: row.position_y,
        });
      }
    });

    return user;
  } catch (err) {
    return undefined;
  }
}

/**
 * deletes a user, specified by their email
 * RETURN type: {success: true/false}
 */
export async function deleteUser(userID: string): Promise<boolean> {
  try {
    await client.query(`DELETE FROM towns WHERE user_id = '${userID}';`);
    await client.query(`DELETE FROM user_preferences WHERE user_id = '${userID}';`);

    return true;
  } catch (err) {
    return false;
  }
}
