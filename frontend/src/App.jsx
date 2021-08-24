import React, { useState, useEffect } from 'react';
import './App.css';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({
    message: '',
    type: '',
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUserBlogApp');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((returnedBlogs) => setBlogs(returnedBlogs));
  }, []);

  const sortedBlogs =
    blogs === null ? null : blogs.sort((a, b) => b.likes - a.likes);

  const logIntoApp = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials);
      window.localStorage.setItem(
        'loggedUserBlogApp',
        JSON.stringify(loggedUser)
      );
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
    } catch (error) {
      setNotification({
        ...notification,
        message: 'Wrong username or password',
        type: 'unsuccessful',
      });
      setTimeout(() => {
        setNotification({
          ...notification,
          message: '',
          type: '',
        });
      }, 4000);
    }
  };

  const handleLogoutBtn = () => {
    window.localStorage.removeItem('loggedUserBlogApp');
    setUser(null);
  };

  const addBlog = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(savedBlog));
      // Send successful notification that blog was added
      setNotification({
        ...notification,
        message: `a new blog '${savedBlog.title}' added`,
        type: 'successful',
      });
      setTimeout(() => {
        setNotification({
          ...notification,
          message: '',
          type: '',
        });
      }, 4000);
    } catch (error) {
      setNotification({
        ...notification,
        message: error.message,
        type: 'unsuccessful',
      });
      setTimeout(() => {
        setNotification({
          ...notification,
          message: '',
          type: '',
        });
      }, 4000);
    }
  };

  const likeBlog = async (id, blog) => {
    try {
      const savedBlog = await blogService.update(id, blog);
      setBlogs(blogs.map((b) => (b.id !== id ? blog : savedBlog)));
    } catch (error) {
      setNotification('Function blog like failed: ', error.message);
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    }
  };

  const removeBlog = async (id) => {
    const blogToRemove = blogs.find((blog) => blog.id === id);
    // Ask user if he wants to remove the blog
    const confirmed = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author} ?`
    );
    // If user doesn't want to - do nothing
    if (!confirmed) {
      return false;
    }
    // Else - remove the blog
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (exception) {
      setNotification({
        ...notification,
        message: 'Deletion of the blog failed',
        type: 'error',
      });
      setTimeout(() => {
        setNotification({ ...notification, message: '', type: '' });
      }, 4000);
    }
    return true;
  };

  const blogForm = () => (
    <div>
      <p>
        <strong>
          <i>{user.name}</i>
        </strong>{' '}
        logged in
        <button className="logout-btn" type="button" onClick={handleLogoutBtn}>
          logout
        </button>
      </p>
      <BlogForm createBlog={addBlog} />
    </div>
  );
  const loginForm = () => <LoginForm logIntoApp={logIntoApp} />;

  return (
    <div>
      <h1>blogs</h1>
      <Notification notification={notification} />
      {user === null ? loginForm() : blogForm()}
      <div className="blogs">
        <h2>blogs</h2>
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
