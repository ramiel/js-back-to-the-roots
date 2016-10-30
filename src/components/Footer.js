const React = require('react')
const FilterLink = require('../containers/FilterLink')

const Footer = () => (
  React.createElement(
    'p',
    null,
    'Show:',
    ' ',
    React.createElement(
      FilterLink,
      { filter: 'SHOW_ALL' },
      'All'
    ),
    ', ',
    React.createElement(
      FilterLink,
      { filter: 'SHOW_ACTIVE' },
      'Active'
    ),
    ', ',
    React.createElement(
      FilterLink,
      { filter: 'SHOW_COMPLETED' },
      'Completed'
    )
  )
)

module.exports = Footer
