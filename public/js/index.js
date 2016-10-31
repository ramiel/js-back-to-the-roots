const React = window.React
const { render } = window.ReactDOM
const { createStore } = window.Redux
const { Provider } = window.ReactRedux
const App = window.App
const reducer = window.reducers

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
