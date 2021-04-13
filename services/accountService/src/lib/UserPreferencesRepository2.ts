import { JoinedTown } from '../AccountTypes';
const { Client } = require('pg');

// const client = new Client({
//     connectionString:
//       'postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@ec2-18-204-101-137.compute-1.amazonaws.com:5432/d46idgb6list1r',
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });

const client = new Client({
  user: 'kisvchxzkztlyx',
  host: 'ec2-18-204-101-137.compute-1.amazonaws.com',
  database: 'd46idgb6list1r',
  password: '02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51',
  port: 5432,
});

client.connect();

export type UserInfo = {
  userID: string;
  userEmail?: string;
  username?: string;
  useAudio?: boolean;
  useVideo?: boolean;
  towns?: JoinedTown[];
};

export async function addUser1(): Promise<void> {
  // harcoded add for test user 1
}

export async function upsertUser(userInfo: UserInfo): Promise<boolean> {
  let userIdQueryResult;
  const userId = userInfo.userID;

  try {
    const userIdQuery = {
      name: 'getUserPreferencesByID',
      text: `SELECT user_id FROM user_preferences WHERE user_id='${userId}';`,
    };

    userIdQueryResult = await client.query(userIdQuery);
  } catch (err) {
    return false;
  }

  if (userId === userIdQueryResult) {
    try {
      const query = {
        name: 'updateUser',
        text:
          'UPDATE user_preferences SET email=ISNULL($1, email), username=ISNULL($2, username), use_audio=ISNULL($3, use_audio), use_video=ISNULL($4, use_video) WHERE user_id = $5',
        values: [userInfo.userEmail, userInfo.username, userInfo.useAudio, userInfo.useVideo],
      };

      await client.query(query);
    } catch (err) {
      return false;
    }
  } else {
    try {
      const query = {
        name: 'insertUser',
        text:
          'INSERT INTO user_preferences (user_id, username, email, use_audio, use_video) VALUES ($1, $2, $3, $4, $5)',
        values: [
          userId,
          userInfo.username,
          userInfo.userEmail,
          userInfo.useAudio,
          userInfo.useVideo,
        ],
      };

      await client.query(query);
    } catch (err) {
      return false;
    }
  }

  return upsertTowns(userInfo);
}

export async function upsertTowns(userInfo: UserInfo): Promise<boolean> {
  const userId = userInfo.userID;
  const townArray = userInfo.towns;

  const toInsert = new Array<JoinedTown>();
  const toUpdate = new Array<JoinedTown>();

  let res;

  try {
    const townQuery = {
      name: 'get-town',
      text: 'SELECT town_id, x_pos, y_pos from towns WHERE user_id=$1',
      values: [userId],
    };
    res = await client.query(townQuery);
  } catch (err) {
    return false;
  }

  for (let row of res.rows) {
    let townInfo: JoinedTown = {
      townID: row.town_id,
      positionX: row.x_pos,
      positionY: row.y_pos,
    };
    toUpdate.push(townInfo);
  }

  townArray?.forEach(town => {
    if (!toUpdate.includes(town)) {
      toInsert.push(town);
    }
  });

  if (toInsert !== undefined && toInsert.length !== 0) {
    try {
      toInsert.forEach(async town => {
        const query = {
          name: 'insert-table',
          text: 'INSERT INTO towns (user_id, town_id, x_pos, y_pos) VALUES ($1, $2, $3, $4, $5)',
          values: [userId, town.townID, town.positionX, town.positionY],
        };

        await client.query(query);
      });
    } catch (err) {
      return false;
    }
  }

  if (toUpdate !== undefined && toUpdate.length !== 0) {
    try {
      toInsert.forEach(async town => {
        const query = {
          name: 'update-table',
          text:
            'UPDATE towns SET town_id=ISNULL($1, town_id), x_pos=ISNULL($2, x_pos), y_pos=ISNULL($3, y_pos) WHERE user_id = $4',
          values: [town.townID, town.positionX, town.positionY, userId],
        };

        client.query(query);
      });
    } catch (err) {
      return false;
    }
  }

  return true;
}

export async function getUserByID(userID: string): Promise<UserInfo | undefined> {
  try {
    const query = {
      name: 'GetUserByID',
      text: `SELECT user_preferences.user_id,
                    user_preferences.user_email,
                    user_preferences.username,
                    user_preferences.useAudio,
                    user_preferences.useVideo,
                    towns.town_id,
                    towns.position_x,
                    towns.position_y
            FROM user_preferences up
            OUTER JOIN towns t ON up.user_id = t.user_id
            WHERE user_id=$1`,
      values: [userID],
    };

    let user: UserInfo | undefined = undefined;
    const response = await client.query(query);
    response.forEach((row: any) => {
      if (!user?.userID) {
        user = {
          userID: row.user_id,
          userEmail: row.user_email,
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
