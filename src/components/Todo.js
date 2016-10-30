const React = require('react')
const { PropTypes } = require('react')

const Todo = ({ onClick, completed, text }) => (
  React.createElement(
    'li',
    {
      onClick: onClick,
      style: {
        textDecoration: completed ? 'line-through' : 'none'
      }
    },
    text
  )
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

module.exports = Todo
