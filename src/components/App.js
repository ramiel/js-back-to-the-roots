const React = require('react')
const Footer = require('./Footer')
const AddTodo = require('../containers/AddTodo')
const VisibleTodoList = require('../containers/VisibleTodoList')

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

module.exports = App
