const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

/* try-catch are eliminated by 'express-async-errors' library */
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body;

  const user = req.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(200).json(savedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blogToDelete = await Blog.findById(req.params.id);
  if (!blogToDelete) {
    return res.status(400).json({ error: 'invalid id' });
  }

  const user = req.user;

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return res
      .status(401)
      .json({ error: 'you don`t have access to delete this blog' });
  }

  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
