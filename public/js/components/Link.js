;(function (window) {
  const React = window.React
  const { PropTypes } = React

  const Link = ({ active, children, onClick }) => {
    if (active) {
      return React.createElement(
      'span',
      null,
      children
    )
    }

    return (
    React.createElement(
      'a',
      { href: '#',
        onClick: e => {
          e.preventDefault()
          onClick()
        }
      },
      children
    )
    )
  }

  Link.propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
  }

  window.Link = Link
})(window)
