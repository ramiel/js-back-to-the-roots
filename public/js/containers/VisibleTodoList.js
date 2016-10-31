;(function (window) {
  const { connect } = window.ReactRedux
  const { toggleTodo } = window.actions
  const TodoList = window.TodoList

  const getVisibleTodos = (todos, filter) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
      default:
        throw new Error('Unknown filter: ' + filter)
    }
  }

  const mapStateToProps = (state) => ({
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  })

  const mapDispatchToProps = ({
    onTodoClick: toggleTodo
  })

  const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoList)

  window.VisibleTodoList = VisibleTodoList
})(window)
