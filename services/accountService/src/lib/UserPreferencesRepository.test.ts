
import { connectToDb, getUserByID, upsertUser, UserInfo } from './UserPreferencesRepository'
const { pg } = require('pg-promise')();

var connectionString = `postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@${'ec2-18-204-101-137.compute-1.amazonaws.com'}/ip:5432/d46idgb6list1r`;
var pgClient = pg(connectionString);

//for things that return
// db.public.many(/* put some sql here */)
//for updating the db
// db.public.none(/* put some sql here */)

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


    // expect(matching)
    //   .toBeDefined();
    // assert(matching);
    // expect(matching.friendlyName)
    //   .toBe(town.friendlyName);

    // 'INSERT INTO user_preferences (user_id, username, email, use_audio, use_video) VALUES ($1, $2, $3, $4, $5)`
    // values: [user_id, userInfo.username, userInfo.email, userInfo.use_audio, userInfo.use_video]
    
    

    
    
  });
  it('adds user if they do not exist in the database ', async () => {});
});
