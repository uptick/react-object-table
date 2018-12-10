import PropTypes from 'prop-types'
import React from 'react'
import Clone from 'clone'
import classNames from 'classnames'

import { cellIsEditable, isDifferent } from './utilities'

import TextDrawer from './drawers/text.jsx'
import TextEditor from './editors/text.jsx'

class ObjectCell extends React.Component {
  static propTypes = {
    column: PropTypes.object,
    objectId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    object: PropTypes.object,
    onMouseDownCell: PropTypes.func,
    disabled: PropTypes.bool,
    beginEdit: PropTypes.func,
    selected: PropTypes.bool,
    copying: PropTypes.bool,
    editing: PropTypes.bool,
    value: PropTypes.any,
    updateField: PropTypes.func,
    abortField: PropTypes.func,
    height: PropTypes.number,
    editReplace: PropTypes.any,
    cellError: PropTypes.func,
    editorContext: PropTypes.object,
    drawerContext: PropTypes.object,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsExemptions = {
      'onMouseDownCell': true,
      'beginEdit': true,
      'updateField': true,
      'abortField': true,
      'cellError': true,
    }
    if (isDifferent(this.props, nextProps, propsExemptions)) {
      return true
    }
    if (isDifferent(this.state, nextState)) {
      return true
    }
    return false
  }

  getCellRef() {
    return {
      columnKey: this.props.column.key,
      objectId: this.props.objectId,
    }
  }

  handleMouseDown = (event) => {
    const button = event.which || event.button
    event.preventDefault()
    if (button === 0) {
      this.props.onMouseDownCell(this.getCellRef(), event.clientX, event.clientY, event.shiftKey)
    }
  }
  handleDoubleClick = (event) => {
    this.beginEdit()
  }
  editable(object) {
    return cellIsEditable(object, this.props.column)
  }
  beginEdit = (editReplaceOverride) => {
    if (!this.props.disabled && this.editable(this.props.object)) {
      this.props.beginEdit(this.getCellRef(), editReplaceOverride)
    }
  }

  render() {
    const classes = classNames('', {
      'selected': this.props.selected,
      'copying': this.props.copying,
      'editing': this.props.editing,
    })

    if (this.props.editing) {
      const editor = this.props.column.editor || TextEditor
      const editorProps = Clone(this.props.column.editorProps || {})
      editorProps.value = this.props.value
      editorProps.update = this.props.updateField
      editorProps.abort = this.props.abortField
      editorProps.objectId = this.props.objectId
      editorProps.column = this.props.column
      editorProps.object = this.props.object
      editorProps.columnKey = this.props.column.key
      editorProps.height = this.props.height
      editorProps.editReplace = this.props.editReplace
      editorProps.cellError = this.props.cellError
      editorProps.context = this.props.editorContext

      return (
        <td
          className={classes + ' editor ' + editor.className}
        >
          <div className="contents">
            {React.createElement(
              editor.component,
              {
                ...editorProps,
                ref: el => { this.editor = el },
              },
              null
            )}
          </div>
        </td>
      )
    } else {
      const drawer = this.props.column.drawer || TextDrawer
      const drawerProps = Clone(this.props.column.drawerProps || {})

      drawerProps.value = this.props.value
      drawerProps.column = this.props.column
      drawerProps.object = this.props.object
      drawerProps.beginEdit = this.beginEdit
      drawerProps.context = this.props.drawerContext

      let cellProps = {
        className: classNames(classes + ' drawer ' + drawer.className, {
          uneditable: (!this.editable(this.props.object)),
        }),
      }
      if (!this.props.column.disableInteraction) {
        cellProps = {
          ...cellProps,
          onMouseDown: this.handleMouseDown,
          onDoubleClick: this.handleDoubleClick,
        }
      }

      return (
        <td
          {...cellProps}
        >
          <div className="contents">
            {React.createElement(
              drawer.component,
              {
                ...drawerProps,
                ref: el => { this.drawer = el },
              },
              null
            )}
          </div>
        </td>
      )
    }
  }
}

export default ObjectCell
