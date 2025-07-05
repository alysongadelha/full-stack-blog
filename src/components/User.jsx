import PropTypes from 'prop-types'

export const User = ({ username }) => {
  return <strong>{username}</strong>
}

User.propTypes = {
  username: PropTypes.string.isRequired,
}
