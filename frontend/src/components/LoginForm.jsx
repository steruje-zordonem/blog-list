import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ logIntoApp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    logIntoApp({ username, password });
    setUsername('');
    setPassword('');
  };

  if (!visible) {
    return (
      <button type="button" onClick={() => setVisible(true)}>
        log in
      </button>
    );
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Username:
          <input
            type="text"
            name="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            name="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      <button type="button" onClick={() => setVisible(false)}>
        cancel
      </button>
    </div>
  );
};

LoginForm.propTypes = {
  logIntoApp: PropTypes.func.isRequired,
};

export default LoginForm;
