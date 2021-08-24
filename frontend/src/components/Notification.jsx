import React from 'react';
import PropTypes from 'prop-types';
import './Notification.css';

const Notification = ({ notification }) => {
  if (!(notification.message && notification.type)) {
    return null;
  }

  return (
    <div className={`notification ${notification.type}`}>
      <h2>{notification.message}</h2>
    </div>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default Notification;
