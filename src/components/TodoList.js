const React = require('react')
const { PropTypes } = require('react')
const Todo = require('./Todo')

const TodoList = ({ todos, onTodoClick }) =>
 React.createElement(
    'ul',
    null,
    todos.map(todo => {
      return React.createElement(
        Todo,
        Object.assign(
          {
            key: todo.id
          },
          todo,
          {
            onClick: () => onTodoClick(todo.id)
          }
        )
      )
    }
  )
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

module.exports = TodoList
