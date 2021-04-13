import { TownInfo, UserInfo } from './UserPreferencesRepository';

/**
 * Connection to the database used for the tests
 */
const { Client } = require('pg');
const client = new Client({
  connectionString:
    'postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@ec2-18-204-101-137.compute-1.amazonaws.com:5432/d46idgb6list1r',
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Mock TownInfo used throughout the tests
 */
const town1: TownInfo = {
  user_id: 'john',
  server_id: 1,
  map_id: 12,
  x_pos: 0,
  y_pos: 0,
};

const town2: TownInfo = {
  user_id: 'john',
  server_id: 2,
  map_id: 12,
  x_pos: 10,
  y_pos: 0,
};

const town3: TownInfo = {
  user_id: 'tatiana',
  server_id: 1,
  map_id: 12,
  x_pos: 10,
  y_pos: 10,
};

/**
 * Mock User Info used throughout the tests
 */
const jeminInfo: UserInfo = {
  user_id: 'jemin',
  email: 'jemin@test.com',
  username: 'jem1',
  use_audio: false,
  use_video: false,
  JoinedTowns: [],
};

const kyleInfo: UserInfo = {
  user_id: 'kyle',
  email: 'kyle@test.com',
  username: 'kyle1',
  use_audio: true,
  use_video: false,
  JoinedTowns: [],
};

const johnInfo: UserInfo = {
  user_id: 'john',
  email: 'john@test.com',
  username: 'john1',
  use_audio: false,
  use_video: true,
  JoinedTowns: [town1, town2],
};

const tatiInfo: UserInfo = {
  user_id: 'tatiana',
  email: 'tati@test.com',
  username: 'tati1',
  use_audio: true,
  use_video: true,
  JoinedTowns: [town3],
};

/**
 * Query to insert specific users for testing
 */
const jeminUserInsert = `INSERT INTO user_preferences VALUES ('jemin', 'jem1', 'jemin@test.com', false, false);`;
const kyleUserInsert = `INSERT INTO user_preferences VALUES ('kyle', 'kyle1', 'kyle@test.com', true, false);`;
const johnUserInsert = `INSERT INTO user_preferences VALUES ('john', 'john1', 'john@test.com', false, true);`;
const tatiUserInsert = `INSERT INTO user_preferences VALUES ('tatiana', 'tati1', 'tati@test.com', true, true);`;

/**
 * Query for inserting to the towns table for the server maps
 */
const johnTownInsert1 = `INSERT INTO towns (user_id, server_id, map_id, x_pos, y_pos) VALUES ('john', 1, 12, 0, 0)`;
const johnTownInsert2 = `INSERT INTO towns (user_id, server_id, map_id, x_pos, y_pos) VALUES ('john', 2, 12, 10, 0)`;
const tatiTownInsert1 = `INSERT INTO towns (user_id, server_id, map_id, x_pos, y_pos) VALUES ('tatiana', 1, 12, 10, 10)`;

describe('deleteUser', () => {
  it('deletes a user (that has no joined town) when given a user in the database', async () => {
    const user_id = 'jemin';
    // Inserts the user into the user_preferences table of the database
    client.connect();
    await client.query(jeminUserInsert);

    // Checks to see if the user was properly added to the database
    let userInfo: UserInfo = { user_id: ' ' };
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

    // delete the user from the database
    let result = false;
    try {
      await client.query(`DELETE FROM user_preferences WHERE user_id = '${user_id}';`);
      await client.query(`DELETE FROM towns WHERE user_id = '${user_id}';`);

      result = true;
    } catch {
      result = false;
    }

    expect(result).toBe(true);
    expect(userInfo).toStrictEqual(jeminInfo);

    client.end();
  });

  it('deletes a user (that has joined towns) when given a user in the database', async () => {
    const user_id = 'john';
    // Inserts the user into the user_preferences table of the database
    client.connect();
    await client.query(johnUserInsert);
    await client.query(johnTownInsert1);
    await client.query(johnTownInsert2);

    // Checks to see if the user was properly added to the database
    const townArray = new Array<TownInfo>();
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

    let userInfo: UserInfo = { user_id: ' ' };
    await client
      .query(`SELECT * FROM user_preferences where user_id = '${user_id}';`)
      .then((res: { rows: any }) => {
        userInfo = {
          user_id: res.rows[0].user_id,
          email: res.rows[0].email,
          username: res.rows[0].username,
          use_audio: res.rows[0].use_audio,
          use_video: res.rows[0].use_video,
          JoinedTowns: townArray,
        };
      });

    // delete the user from the database
    let result = false;
    try {
      await client.query(`DELETE FROM user_preferences WHERE user_id = '${user_id}';`);
      await client.query(`DELETE FROM towns WHERE user_id = '${user_id}';`);

      result = true;
    } catch {
      result = false;
    }

    expect(userInfo).toStrictEqual(johnInfo);
    expect(result).toBe(true);

    client.end();
  });
});

describe('getUserByID', () => {
  it('retrieves a user in the database by the given id', async () => {
    // literally repeat the tests above but replace JUST the part where we retrieve userInfo with the function call
  });

  it('attempts to retrieve a nonexistent user by the given id but fails', async () => {
    // similar format to above
  });
});

describe('upsertUser', () => {
  it('inserts a user into the database given a userInfo', async () => {
    client.connect();
    const user_id = 'jemin';

    const query1 = {
      name: 'insert-user',
      text:'INSERT INTO user_preferences (user_id, username, email, use_audio, use_video) VALUES ($1, $2, $3, $4, $5)',
      values: [user_id, 'jem1', 'jemin@test.com', false, false],
    };

    await client.query(query1).then((err: any) => {
      if (err) {
        return false;
      }
    });

    const query = {
      name: 'update-user',
      text:
        'UPDATE user_preferences SET email=ISNULL($1, email), username=ISNULL($2, username), use_audio=ISNULL($3, use_audio), use_video=ISNULL($4, use_video) WHERE user_id = $5',
      values: ['userInfo.email', 'username', true, true],
    };

    await client.query(query).then((err: any) => {
      if (err) {
        return false;
      }
    });

    client.end();
    it('updates a user in the database given a userInfo', async () => {
      // similar format to above
    });
  });
});

describe('upsertTowns', () => {
  it('inserts the town information of a user given a userInfo', async () => {
    // literally repeat the tests above but replace JUST the part where we retrieve upsertTowns with the function call
  });

  it('updates the town information of a user given a userInfo', async () => {
    // similar format to above
  });
});
