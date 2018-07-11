import PropTypes from 'prop-types'
import React from 'react'

function validate(value, props) {
  return {
    valid: true,
    cleanedValue: value,
  }
}

class BaseEditor extends React.Component {
  static propTypes = {
    editReplace: PropTypes.any,
    value: PropTypes.any,
    abort: PropTypes.func,
    update: PropTypes.func,
    cellError: PropTypes.func,
    objectId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    columnKey: PropTypes.string,
  }
  static defaultProps = {
    editReplace: null,
  }
  state = {
    value: (this.props.editReplace !== null) ? this.props.editReplace : this.props.value,
  }

  validate(value) {
    return validate(value, this.props)
  }

  abort(nextAction) {
    this.props.abort(nextAction)
  }

  commit(value, nextAction) {
    let validation = this.validate(value)

    if (validation.valid) {
      this.props.update(
        this.props.objectId,
        this.props.columnKey,
        validation.cleanedValue,
        nextAction,
      )
    } else {
      this.props.cellError(
        this.props.objectId,
        this.props.columnKey,
        `"${value}" is not a valid value.`
      )
      this.abort(nextAction)
    }
  }

  handleBlur = (event) => {
    this.commit(this.state.value, false)
  }
  handleSubmit = (event) => {
    event.preventDefault()
    this.commit(this.state.value, 'nextRow')
  }
  handleKeyDown = (event) => {
    if (event.which === 9) {
      event.preventDefault()
      this.commit(this.state.value, 'nextColumn')
    }
    if (event.which === 27) {
      event.preventDefault()
      this.abort(false)
    }
  }
}

export default BaseEditor
