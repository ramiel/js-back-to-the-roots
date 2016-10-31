;(function (window) {
  const React = window.React
  const FilterLink = window.FilterLink

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

  window.Footer = Footer
})(window)
