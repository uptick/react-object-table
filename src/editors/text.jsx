import React from 'react'
import BaseEditor from './../base-editor'

function validate(value, props) {
  return {
    valid: true,
    cleanedValue: String(value),
  }
}

class TextEditor extends BaseEditor {
  componentDidMount() {
    if (this.props.editReplace) {
      this.refs.field.setSelectionRange(this.state.value.length, this.state.value.length)
    }
  }

  validate(value) {
    return validate(value, this.props)
  }

  handleChange = (event) => {
    let newValue = this.refs.field.value
    this.setState(state => {
      state.value = newValue
      return state
    })
  }

  handleFocus = (event) => {
    let reactClass = this
    if (this.props.editReplace === null) {
      window.setTimeout(function() {
        let inputElement = reactClass.refs.field
        inputElement.select()
      }, 0)
    }
  }

  render() {
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
          autoFocus
          style={{
            height: '' + (this.props.height - 2) + 'px',
            lineHeight: '' + (this.props.height - 2) + 'px',
            // fontSize: '' + (this.props.height - 4) + 'px',
          }}
        />
      </form>
    )
  }
}

export default {
  className: 'text-editor',
  component: TextEditor,
  validate: validate,
}
