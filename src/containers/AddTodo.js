const React = require('react')
const { connect } = require('react-redux')
const { addTodo } = require('../actions')

let AddTodo = ({ dispatch }) => {
  let input

  return React.createElement(
    'div',
    null,
    React.createElement(
      'form',
      {
        onSubmit: e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          dispatch(addTodo(input.value))
          input.value = ''
        }
      },
      React.createElement(
        'input',
        {
          ref: node => {
            input = node
          }
        }
      ),
      React.createElement(
        'button',
        { type: 'submit' },
        'Add Todo'
      )
    )
  )
}
AddTodo = connect()(AddTodo)

module.exports = AddTodo
