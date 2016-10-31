;(function (window) {
  const React = window.React
  const Footer = window.Footer
  const AddTodo = window.AddTodo
  const VisibleTodoList = window.VisibleTodoList

  class App extends React.Component {
    render () {
      return React.createElement(
            'div',
            null,
            React.createElement(AddTodo, null),
            React.createElement(VisibleTodoList, null),
            React.createElement(Footer, null)
        )
    }
    }

  window.App = App
})(window)
