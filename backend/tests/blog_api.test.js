const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const jwt = require('jsonwebtoken');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

let token;
let user;

// Create an user before doing tests
beforeAll(async () => {
  // Create user
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('password', 10);
  user = new User({ username: 'root', name: 'su', passwordHash });
  await user.save();

  // Get token for this user
  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'password' })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  token = response.body.token;
});

// Initialize DB before every test
beforeEach(async () => {
  // Create blog
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('unique identifier for blog is named "id" instead "_id"', async () => {
    const blogs = await helper.blogsInDb();
    const blogToView = blogs[0];

    expect(blogToView.id).toBeDefined();

    const response = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.id).toBeDefined();
  });
});

describe.only('Addition of a new blog', () => {
  test('new blog is correctly added to the server', async () => {
    const newBlog = {
      title: 'New blog 22',
      author: 'Gall Anonim',
      url: 'www.newblogeveryday.org',
      likes: 1,
      user: user.id,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain(newBlog.title);
  });

  test('with blog with missing likes property it is default to 0', async () => {
    const newBlog = {
      title: 'New blog 22',
      author: 'Gall Anonim',
      url: 'www.newblogeveryday.org',
      user: user.id,
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test(`blog won't be added if title or url properties are missing`, async () => {
    const blogWithoutTitle = {
      author: 'Gall Anonim',
      url: 'www.newblogeveryday.org',
      likes: 5,
      user: user.id,
    };

    const blogWithoutUrl = {
      title: 'New blog 22',
      author: 'Gall Anonim',
      likes: 5,
      user: user.id,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400);

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    console.log(helper.nonExistingId);
  });

  test('fails with statuscode 401 if token is not provided', async () => {
    const newBlog = {
      title: 'New blog 22',
      author: 'Gall Anonim',
      url: 'www.newblogeveryday.org',
      likes: 1,
      user: user.id,
    };

    const result = await api.post('/api/blogs').send(newBlog).expect(401);

    expect(result.body.error).toContain('invalid token');
  });
});

describe('Deletion of a blog', () => {
  test('blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });

  test('blog with incorrect ID returns http code 400', async () => {
    const id = mongoose.Types.ObjectId();
    await api.delete(`/api/blogs/${id}`).expect(400);
  });
});

describe('Update of a blog', () => {
  test('Blog likes can be updated', async () => {
    // Updated will be first blog (blogsAtStart[0])
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = { ...blogsAtStart[0], likes: 55 };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

    expect(updatedBlog).toEqual(blogToUpdate);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
