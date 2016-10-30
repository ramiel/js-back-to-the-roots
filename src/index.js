const React = require('react')
const { render } = require('react-dom')
const { createStore } = require('redux')
const { Provider } = require('react-redux')
const App = require('./components/App')
const reducer = require('./reducers')

const store = createStore(reducer)

const element = React.createElement(
  Provider,
  {store},
  React.createElement(App, null)
)
render(
  element,
  document.getElementById('root')
)
