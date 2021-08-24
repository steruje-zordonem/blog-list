const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (accumulator, currentValue) => {
    return accumulator + currentValue.likes;
  };

  return blogs.reduce(reducer, 0);
};

const mostBlogs = (blogs) => {
  // Get list of authors and add them to the array
  const authors = [];
  blogs.forEach((blog) => {
    if (!authors.includes(blog.author)) {
      authors.push(blog.author);
    }
  });
  // Create array of objects({author, blogs}) out of it
  const objAuthors = [];
  authors.map((author) =>
    objAuthors.push({
      author: author,
      blogs: 0,
    })
  );
  // Loop through the blogs once again, and calculate
  // number of blogs for each author
  blogs.forEach((blog) => {
    const found = objAuthors.find((obj) => obj.author === blog.author);
    if (found) {
      found.blogs++;
    }
  });
  // Return author with most blogs
  const mostBlogsValue = Math.max(...objAuthors.map((obj) => obj.blogs));
  const authorOfMostBlogs = objAuthors.find(
    (obj) => obj.blogs === mostBlogsValue
  );
  return authorOfMostBlogs;
};

const mostLikes = (blogs) => {
  // Find the authors of blogs and add them to the array
  const authors = [];
  blogs.forEach((blog) => {
    if (!authors.includes(blog.author)) {
      authors.push(blog.author);
    }
  });
  // Create array of objects({author, likes}) out of it
  const objAuthors = [];
  authors.map((author) =>
    objAuthors.push({
      author: author,
      likes: 0,
    })
  );
  // Loop through the blogs once again, and calculate
  // number of likes for each author's blog
  blogs.forEach((blog) => {
    const found = objAuthors.find((obj) => obj.author === blog.author);
    if (found) {
      found.likes += blog.likes;
    }
  });
  // Return author with most likes
  const mostLikesValue = Math.max(...objAuthors.map((obj) => obj.likes));
  const mostLikedAuthor = objAuthors.find(
    (obj) => obj.likes === mostLikesValue
  );
  return mostLikedAuthor;
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let favourite = blogs[0];
  blogs.forEach((blog) => {
    if (blog.likes > favourite.likes) {
      favourite = blog;
    }
  });
  return favourite;
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
