;(function (window) {
  const React = window.React
  const { connect } = window.ReactRedux
  const { addTodo } = window.actions

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

  window.AddTodo = AddTodo
})(window)
