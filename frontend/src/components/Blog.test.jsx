import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;

  const blog = {
    title: 'blog to test',
    author: 'tester123',
    url: 'www.testing.com',
    likes: 0,
    user: '611b287bde383e1550194b44',
    id: '6120125c68900c3be85ecxc8',
  };

  const user = {
    username: 'tester',
    name: 'Tester Testerski',
    token: '123456789xxx987654321',
  };

  const likeBlog = jest.fn();
  const removeBlog = jest.fn();

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
        user={user}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
      />
    );
  });

  test(`renders the blog's title and author`, () => {
    const blogDiv = component.container.querySelector('.blog');

    expect(blogDiv).toHaveTextContent(`${blog.title} - ${blog.author}`);
    expect(blogDiv).not.toHaveTextContent(`${blog.url}`);
    expect(blogDiv).not.toHaveTextContent(`${blog.likeu}`);
  });

  test(`url and likes are shown when 'show' button is clicked`, () => {
    const showButton = component.container.querySelector('.blog-btn');
    fireEvent.click(showButton);

    const blogDiv = component.container.querySelector('.blog');
    expect(blogDiv).toHaveTextContent(`${blog.url}`);
    expect(blogDiv).toHaveTextContent(`${blog.likes}`);
  });

  test('if like button clicked twice, event handler is called twice', () => {
    const showButton = component.container.querySelector('.blog-btn');
    fireEvent.click(showButton);

    const likeButton = component.container.querySelector('.like-btn');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(likeBlog.mock.calls.length).toBe(2);
  });
});
