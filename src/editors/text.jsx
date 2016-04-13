const React = require('react');
const BaseEditor = require('./../base-editor');

const validate = function(value, props) {
  return {
    valid: true,
    cleanedValue: value,
  };
};

class TextEditor extends BaseEditor {
  componentDidMount() {
    if (this.props.editReplace)
      this.refs.field.setSelectionRange(this.state.value.length, this.state.value.length);
  }

  validate(value) {
    return validate(value, this.props);
  }

  handleChange(event) {
    var newValue = this.refs.field.value;
    this.setState(state => {
      state.value = newValue;
      return state;
    });
  }

  handleFocus(event) {
    var reactClass = this;
    if (this.props.editReplace === null) {
      window.setTimeout(function() {
        var inputElement = reactClass.refs.field;
        inputElement.select();
      }, 0);
    }
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
      >
        <input
          ref="field"
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          autoFocus={true}
          style={{
            height: '' + (this.props.height - 2) + 'px',
            lineHeight: '' + (this.props.height - 2) + 'px',
            // fontSize: '' + (this.props.height - 4) + 'px',
          }}
        />
      </form>
    );
  }
};

module.exports = {
  className: 'text-editor',
  component: TextEditor,
  validate: validate,
};
