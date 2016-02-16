var React = require('react');

var TextDrawer = React.createClass({
  getDefaultProps: function() {
    return {};
  },
  getInitialState: function() {
    return {};
  },

  render: function() {
    return (
      <span>{this.props.value}</span>
    );
  },
});

module.exports = {
  className: 'text-drawer',
  component: TextDrawer,
};
