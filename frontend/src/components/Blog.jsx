import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Blog.css';

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const [fullView, setFullView] = useState(false);

  if (!fullView) {
    return (
      <div className="blog">
        <p>
          {blog.title} - {blog.author}
          <button
            type="button"
            className="blog-btn"
            onClick={() => setFullView(true)}
          >
            show
          </button>
        </p>
      </div>
    );
  }

  const handleLikeBtn = () => {
    const updatedBlog = {
      likes: blog.likes + 1,
      title: blog.title,
      author: blog.author,
      user: blog.user.id,
      url: blog.url,
    };
    likeBlog(blog.id, updatedBlog);
  };

  const removeButton =
    user.username === blog.user.username ? (
      <button type="button" onClick={() => removeBlog(blog.id)}>
        remove
      </button>
    ) : null;

  return (
    <div className="blog">
      <p>
        {blog.title} - {blog.author}
        <button type="button" onClick={() => setFullView(false)}>
          hide
        </button>
      </p>
      <p>{blog.url}</p>
      <p>
        {blog.likes}
        <button type="button" className="like-btn" onClick={handleLikeBtn}>
          like
        </button>
      </p>
      {blog.user.name !== null ? <p>{blog.user.name}</p> : null}
      {removeButton}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        username: PropTypes.string,
        name: PropTypes.string,
      }),
    ]).isRequired,
    id: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
