import PropTypes from 'prop-types'
import React from 'react'
import JQuery from 'jquery'
import classNames from 'classnames'

import { dictCount, isDifferent } from './utilities.js'

class ObjectRow extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    object: PropTypes.object,
    openActions: PropTypes.func,
    closeActions: PropTypes.func,
    actions: PropTypes.array,
    columns: PropTypes.array,
    editing: PropTypes.object,
    height: PropTypes.number,
    editReplace: PropTypes.any,
    selectedColumns: PropTypes.object,
    copyingColumns: PropTypes.object,
    onMouseDownCell: PropTypes.func,
    beginEdit: PropTypes.func,
    updateField: PropTypes.func,
    abortField: PropTypes.func,
    cellError: PropTypes.func,
    actionsOpen: PropTypes.bool,
    cellComponent: PropTypes.func,
    cellProps: PropTypes.object,
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isMissingColumns = function(propsA, propsB, columnsKey) {
      for (const key in propsA[columnsKey]) {
        if (key in propsB[columnsKey] === false) {
          // console.log('key', key, 'does not exist in both')
          return true
        }
      }
      return false
    }
    if (isMissingColumns(nextProps, this.props, 'selectedColumns') || isMissingColumns(this.props, nextProps, 'selectedColumns')) {
      return true
    }
    if (isMissingColumns(nextProps, this.props, 'copyingColumns') || isMissingColumns(this.props, nextProps, 'copyingColumns')) {
      return true
    }

    const propsExemptions = {
      // ignore column we perform above
      'selectedColumns': true,
      'copyingColumns': true,

      // ignore bound methods
      'updateField': true,
      'abortField': true,
      'openActions': true,
      'closeActions': true,
      'onMouseDownCell': true,
      'beginEdit': true,
    }
    if (isDifferent(this.props, nextProps, propsExemptions)) {
      return true
    }
    if (isDifferent(this.state, nextState)) {
      return true
    }
    return false
  }

  colInRanges(column, columns, rows) {
    const numRangeColumns = dictCount(columns)
    const numRangeRows = dictCount(rows)
    if (numRangeColumns === 0 && numRangeRows === 0) {
      return false
    } else if (columns !== null && rows === null) {
      return (typeof columns[column.key] !== 'undefined')
    } else if (columns === null && rows !== null) {
      return true
    }
    return (
      typeof columns[column.key] !== 'undefined' &&
      typeof rows[this.props.object.id] !== 'undefined'
    )
  }

  openActions = (event) => {
    this.props.openActions(this.props.object.id)
  }
  closeActions = (event) => {
    this.props.closeActions()
  }
  onActionClick = (event) => {
    let actionId = JQuery(event.target).data('action')
    let action = this.props.actions[actionId]
    if (action) {
      this.props.actions[actionId].func(this.props.object.id)
      if (!action.stayOpen) {
        this.props.closeActions()
      }
    }
  }

  renderCells() {
    let cells = []
    for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
      let column = this.props.columns[columnIndex]
      let editing = false
      if (this.props.editing !== null) {
        editing = (
          this.props.editing.objectId === this.props.object.id &&
          this.props.editing.columnKey === column.key
        )
      }

      let ref = 'column-' + column.key

      let cellProps = {
        key: ref,
        ref: ref,

        value: this.props.object[column.key],
        objectId: this.props.object.id,
        object: this.props.object,

        column: column,
        height: this.props.height,
        editReplace: this.props.editReplace,
        selected: (typeof this.props.selectedColumns[column.key] !== 'undefined'),
        copying: (typeof this.props.copyingColumns[column.key] !== 'undefined'),

        onMouseDownCell: this.props.onMouseDownCell,
        beginEdit: this.props.beginEdit,

        updateField: this.props.updateField,
        abortField: this.props.abortField,
        cellError: this.props.cellError,
      }

      cellProps.editorContext = null
      if (editing && column.editorContext) {
        cellProps.editorContext = column.editorContext(this.props.object)
      }
      if (!editing && column.drawerContext) {
        cellProps.drawerContext = column.drawerContext(this.props.object)
      }

      cellProps.disabled = (this.props.object.disabled === true)
      if (this.props.object.disabled) {
        cellProps.editing = false
      } else {
        cellProps.editing = editing
      }
      cells.push(
        <this.props.cellComponent
          {...this.props.cellProps}
          {...cellProps}
        />
      )
    }
    if (this.props.actions && this.props.actions.length) {
      let cellStyle = {
        lineHeight: this.props.height + 'px',
      }
      if (this.props.actionsOpen && !this.props.object.disabled) {
        let actions = []
        this.props.actions.map((action, index) => {
          let actionEnabled = action.enabled
          let tooltip
          if (!(actionEnabled === undefined)) {
            if (typeof actionEnabled === 'function') actionEnabled = actionEnabled(this.props.object)
            if (Array.isArray(actionEnabled)) {
              [actionEnabled, tooltip] = actionEnabled
            }
          } else {
            actionEnabled = true
          }
          actions.push(
            <li
              key={'action-' + index}
              title={tooltip}
              className={classNames({'disabled': !actionEnabled}, 'action')}
              onClick={actionEnabled ? this.onActionClick : null}
              data-action={index}
              >
              {action.label}
            </li>
            )
        })
        cells.push(
          <td
            key="actions"
            ref={el => { this.actions = el }}
            className="actions open"
            style={cellStyle}
          >
            <span onClick={this.closeActions}>&#9776;</span>
            <ul className="actions">
              {actions}
            </ul>
          </td>
        )
      } else {
        cells.push(
          <td
            key="actions"
            ref={el => { this.actions = el }}
            className="actions closed"
            onClick={this.openActions}
            style={cellStyle}
          >
            <span>&#9776;</span>
          </td>
        )
      }
    }
    return cells
  }

  render() {
    return (
      <tr
        className={classNames('', {disabled: (this.props.object.disabled === true)})}
        style={{
          height: '' + this.props.height + 'px',
        }}
      >
        {this.renderCells()}
      </tr>
    )
  }
}

export default ObjectRow
