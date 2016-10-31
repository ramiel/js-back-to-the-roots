;(function (window) {
  const { combineReducers } = window.Redux
  const todos = window.todos
  const visibilityFilter = window.visibilityFilter

  const todoApp = combineReducers({
    todos,
    visibilityFilter
  })

  window.reducers = todoApp
})(window)
