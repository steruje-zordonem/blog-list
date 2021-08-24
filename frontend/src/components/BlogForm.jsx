import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [visible, setVisible] = useState(false);

  const handleForm = (event) => {
    event.preventDefault();

    createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  if (!visible) {
    return (
      <button type="button" onClick={() => setVisible(true)}>
        create new blog
      </button>
    );
  }

  return (
    <>
      <form onSubmit={handleForm}>
        <h2>create new</h2>
        <div>
          title:
          <input
            type="text"
            name="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="Url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      <button type="button" onClick={() => setVisible(false)}>
        cancel
      </button>
    </>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
