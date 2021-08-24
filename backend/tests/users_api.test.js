const bcrypt = require('bcrypt');
const app = require('../app');
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

describe('When there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('valid users are created', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'matti',
      name: 'Matheus',
      password: 'sekret',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test(`user with invalid username won't be created`, async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'Treeman',
      password: 'password',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test(`user with invalid password won't be created`, async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'kameal',
      name: 'Kamil',
      password: 'xx',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain(
      'password should be at least 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
