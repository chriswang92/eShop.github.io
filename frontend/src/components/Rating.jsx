import React from 'react';
import PropTypes from 'prop-types';

const getStars = (value, color) => {
  const numbers = [...Array(5).keys()].map(x => ++x);
  return numbers.map(key => {
    return (
      <i
        key={key}
        style={{ color }}
        className={
          value >= key
            ? 'fas fa-star'
            : value >= key - 0.5
            ? 'fas fa-star-half-alt'
            : 'far fa-star'
        }
      />
    );
  });
};

const Rating = ({ value, text, color }) => {
  return (
    <div className='rating'>
      <span>{getStars(value, color)}</span>
      <span>{text}</span>
    </div>
  );
};

Rating.defaultProps = {
  color: '#f8e825',
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default Rating;
