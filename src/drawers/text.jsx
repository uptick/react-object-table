import PropTypes from 'prop-types'
import React from 'react'

class TextDrawer extends React.Component {
  static propTypes = {
    value: PropTypes.string,
  }
  render() {
    return (
      <span>{String(this.props.value)}</span>
    )
  }
}

export default {
  className: 'text-drawer',
  component: TextDrawer,
}
