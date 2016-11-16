import React from 'react'

class TextDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span>{this.props.value}</span>
    );
  }
}
TextDrawer.defaultProps = {};

export default {
  className: 'text-drawer',
  component: TextDrawer,
}
