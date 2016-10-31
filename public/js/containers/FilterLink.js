;(function (window) {
  const { connect } = window.ReactRedux
  const { setVisibilityFilter } = window.actions
  const Link = window.Link

  const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.visibilityFilter
  })

  const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  })

  const FilterLink = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Link)

  window.FilterLink = FilterLink
})(window)
