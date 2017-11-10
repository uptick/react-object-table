import PropTypes from 'prop-types'
import React from 'react'
import Clone from 'clone'
import classNames from 'classnames'

import { cellIsEditable } from './utilities'

import TextDrawer from './drawers/text.jsx'
import TextEditor from './editors/text.jsx'

class ObjectCell extends React.Component {
  static propTypes = {
    column: PropTypes.object,
    objectId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
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
    let isShallowDifferent = function(objectA, objectB, exemptions) {
      for (let key in objectA) {
        if (exemptions && key in exemptions) {
          continue
        }
        if (objectB[key] !== objectA[key]) {
          // console.log('key', key, 'does not equal')
          return true
        }
      }
      return false
    }
    let propsExemptions = {
      'onMouseDownCell': true,
      'beginEdit': true,
      'updateField': true,
      'abortField': true,
      'cellError': true,
    }
    if (isShallowDifferent(this.props, nextProps, propsExemptions) || isShallowDifferent(nextProps, this.props, propsExemptions)) {
      return true
    }
    if (isShallowDifferent(this.state, nextState) || isShallowDifferent(nextState, this.state)) {
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
    let button = event.which || event.button
    event.preventDefault()
    if (button === 0) {
      this.props.onMouseDownCell(this.getCellRef(), event.clientX, event.clientY, event.shiftKey)
    }
  }
  handleDoubleClick = (event) => {
    this.beginEdit()
  }
  editable(objectId) {
    return cellIsEditable(objectId, this.props.column)
  }
  beginEdit = (editReplaceOverride) => {
    if (!this.props.disabled && this.editable(this.getCellRef().objectId)) {
      this.props.beginEdit(this.getCellRef(), editReplaceOverride)
    }
  }

  render() {
    let classes = classNames('', {
      'selected': this.props.selected,
      'copying': this.props.copying,
      'editing': this.props.editing,
    })

    if (this.props.editing) {
      let editor = this.props.column.editor || TextEditor
      let editorProps = Clone(this.props.column.editorProps || {})
      editorProps.ref = 'editor'
      editorProps.value = this.props.value
      editorProps.update = this.props.updateField
      editorProps.abort = this.props.abortField
      editorProps.objectId = this.props.objectId
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
              editorProps,
              null
            )}
          </div>
        </td>
      )
    } else {
      let drawer = this.props.column.drawer || TextDrawer
      let drawerProps = Clone(this.props.column.drawerProps || {})
      drawerProps.ref = 'drawer'
      drawerProps.value = this.props.value
      drawerProps.beginEdit = this.beginEdit
      drawerProps.context = this.props.drawerContext

      let cellProps = {
        className: classNames(classes + ' drawer ' + drawer.className, {
          uneditable: (!this.editable(this.getCellRef().objectId)),
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
              drawerProps,
              null
            )}
          </div>
        </td>
      )
    }
  }
}

export default ObjectCell
