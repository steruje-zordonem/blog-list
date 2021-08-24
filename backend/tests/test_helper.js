const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Welcome to the jungle',
    author: 'Kurt Kombajn',
    url: 'www.podrozemaleiduze.pl',
    likes: 22,
  },
  {
    title: 'Have you ever tried DMT',
    author: 'Roe Jogan',
    url: 'www.thejreexperience.com',
    likes: 321,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
