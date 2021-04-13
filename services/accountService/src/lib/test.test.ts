const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgres://kisvchxzkztlyx:02c7828881c5e71290f509916361926b80923b88c0dddeaf170cb111cdbb4c51@ec2-18-204-101-137.compute-1.amazonaws.com:5432/d46idgb6list1r',
  ssl: {
    rejectUnauthorized: false,
  },
});

describe('test', () => {
  client.connect();
  it('connects', async () => {
    const query = 'SELECT * FROM user_preferences';
    client.connect();
    const res = await client.query(query);
    console.log(res);
  });
});
