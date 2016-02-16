var React = require('react');

var validate = function(value, props) {
  return {
    valid: true,
    cleanedValue: value,
  };
};

var TextEditor = React.createClass({
  getDefaultProps: function() {
    return {
      editReplace: null,
    };
  },
  getInitialState: function() {
    var startValue = this.props.editReplace === null ? this.props.value : this.props.editReplace;
    return {
      value: startValue,
    };
  },

  getValue: function(raise) {
    var validation = validate(this.state.value, this.props);
    if (validation.valid)
      return validation.cleanedValue;
    else {
      if (raise && typeof window.notify == 'function') {
        window.notify({
          style: 'error',
          title: 'Cannot update ' + this.props.columnKey,
          body: '"' + this.state.value + '" is not a valid decimal value.',
        });
      }
      return this.props.value;
    }
  },

  componentDidMount: function() {
    if (this.props.editReplace)
      this.refs.field.getDOMNode().setSelectionRange(this.state.value.length, this.state.value.length);
  },

  handleChange: function(event) {
    var newValue = this.refs.field.getDOMNode().value;
    this.setState(state => {
      state.value = newValue;
      return state;
    });
  },
  handleBlur: function(event) {
    this.props.update(this.props.objectId, this.props.columnKey, this.getValue(), false);
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.props.update(this.props.objectId, this.props.columnKey, this.getValue(), 'nextRow');
  },
  handleKeyDown: function(event) {
    if (event.which == 9) {
      this.props.update(this.props.objectId, this.props.columnKey, this.getValue(), 'nextColumn');
      event.preventDefault();
    }
    if (event.which == 27) {
      this.props.abort(false);
      event.preventDefault();
    }
  },
  handleFocus: function(event) {
    var reactClass = this;
    if (this.props.editReplace === null) {
      window.setTimeout(function() {
        var inputElement = reactClass.refs.field.getDOMNode();
        inputElement.select();
      }, 0);
    }
  },

  render: function() {
    return (
      <form
        onSubmit={this.handleSubmit}
        onKeyDown={this.handleKeyDown}
      >
        <input
          ref="field"
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          autoFocus={true}
          style={{
            height: '' + (this.props.height - 2) + 'px',
            lineHeight: '' + (this.props.height - 2) + 'px',
            // fontSize: '' + (this.props.height - 4) + 'px',
          }}
        />
      </form>
    );
  },
});

module.exports = {
  className: 'text-editor',
  component: TextEditor,
  validate: validate,
};
