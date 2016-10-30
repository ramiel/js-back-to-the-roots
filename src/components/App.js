const React = require('react')
const Footer = require('./Footer')
const AddTodo = require('../containers/AddTodo')
const VisibleTodoList = require('../containers/VisibleTodoList')

class App extends React.Component {
  render () {
    return (<div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>)
  }
}

module.exports = App
