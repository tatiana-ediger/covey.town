import { connectToDb, deleteUser, getUserByID, upsertUser, UserInfo } from './UserPreferencesRepository'
const { pg } = require('pg-promise')();

var connectionString = `postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@${'ec2-18-204-101-137.compute-1.amazonaws.com'}/ip:5432/d46idgb6list1r`;
var pgClient = pg(connectionString);

describe('upsertUser', () => {
  it('updates existing user when given an existing user in the database', async () => {
    connectToDb();
    pgClient.query(`INSERT INTO user_preferences VALUES ('1A2B3C', 'User', 'email@gmail.com', true, true);`);
    
    let userInfo: UserInfo = {
        user_id: '1A2B3C',
        email: 'email1@gmail.com',
        username: 'User1',
        use_audio: false,
        use_video: false,
        JoinedTowns: [],
      };

    upsertUser(userInfo);
    expect(getUserByID('1A2B3C'))
      .toBe(userInfo);

    const result = deleteUser('1A2B3C');
    expect(result)
    .toBe(1);
  });
  it('adds user if they do not exist in the database ', async () => {
    connectToDb();
    
    let userInfo: UserInfo = {
        user_id: 'Test1',
        email: 'testMail1@gmail.com',
        username: 'testUser1',
        use_audio: false,
        use_video: false,
        JoinedTowns: [],
      };

    upsertUser(userInfo);
    expect(getUserByID('Test1'))
      .toBe(userInfo);
    });

    const result = deleteUser('Test1');
    expect(result)
    .toBe(1);
});
