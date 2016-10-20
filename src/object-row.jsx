import React from 'react'
import JQuery from 'jquery'
import classNames from 'classnames'

import Utilities from './utilities'

import ObjectCell from './object-cell'

class ObjectRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    var isMissingColumns = function(propsA, propsB, columnsKey) {
      for (var key in propsA[columnsKey]) {
        if (key in propsB[columnsKey] === false) {
          // console.log('key', key, 'does not exist in both');
          return true;
        }
      }
      return false;
    };
    if (isMissingColumns(nextProps, this.props, 'selectedColumns') || isMissingColumns(this.props, nextProps, 'selectedColumns')) {
      return true;
    }
    if (isMissingColumns(nextProps, this.props, 'copyingColumns') || isMissingColumns(this.props, nextProps, 'copyingColumns')) {
      return true;
    }

    var isShallowDifferent = function(objectA, objectB, exemptions) {
      for (var key in objectA) {
        if (exemptions && key in exemptions) {
          continue;
        }
        if (objectB[key] !== objectA[key]) {
          // console.log('key', key, 'does not equal');
          return true;
        }
      }
      return false;
    };

    var propsExemptions = {
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
    };
    if (isShallowDifferent(this.props, nextProps, propsExemptions) || isShallowDifferent(nextProps, this.props, propsExemptions)) {
      return true;
    }
    if (isShallowDifferent(this.state, nextState) || isShallowDifferent(nextState, this.state)) {
      return true;
    }
    return false;
  }

  colInRanges(column, columns, rows) {
    var numRangeColumns = Utilities.dict_count(columns);
    var numRangeRows = Utilities.dict_count(rows);
    if (numRangeColumns == 0 && numRangeRows === 0) {
      return false;
    }
    else if (columns !== null && rows === null) {
      return (typeof columns[column.key] != 'undefined');
    }
    else if (columns === null && rows !== null) {
      return true;
    }
    return (
      typeof columns[column.key] != 'undefined'
      && typeof rows[this.props.object.id] != 'undefined'
    );
  }

  openActions(event) {
    this.props.openActions(this.props.object.id);
  }
  closeActions(event) {
    this.props.closeActions();
  }
  onActionClick(event) {
    var reactClass = this;
    var actionId = JQuery(event.target).data('action');
    var action = this.props.actions[actionId];
    if (action) {
      reactClass.props.actions[actionId].func(reactClass.props.object.id);
      if (!action.stayOpen)
        reactClass.props.closeActions();
    }
  }

  render() {
    var cells = [];
    for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
      var column = this.props.columns[columnIndex];
      var editing = false;
      if (this.props.editing !== null) {
        editing = (
          this.props.editing.objectId == this.props.object.id
          && this.props.editing.columnKey == column.key
        );
      }

      var ref = 'column-' + column.key;
      var cellProps = {
        key: ref,
        ref: ref,

        value: this.props.object[column.key],
        objectId: this.props.object.id,

        column: column,
        height: this.props.height,
        editReplace: this.props.editReplace,
        selected: (typeof this.props.selectedColumns[column.key] != 'undefined'),
        copying: (typeof this.props.copyingColumns[column.key] != 'undefined'),

        onMouseDownCell: this.props.onMouseDownCell,
        beginEdit: this.props.beginEdit,

        updateField: this.props.updateField,
        abortField: this.props.abortField,
        cellError: this.props.cellError,
      };
      cellProps.editorContext = null;
      if (editing && column.editorContext)
        cellProps.editorContext = column.editorContext(this.props.object);
      if (!editing && column.drawerContext)
        cellProps.drawerContext = column.drawerContext(this.props.object);

      cellProps.disabled = (this.props.object.disabled === true);
      if (this.props.object.disabled)
        cellProps.editing = false;
      else
        cellProps.editing = editing;

      cells.push(
        <ObjectCell
          {...cellProps}
        />
      );
    }
    if (this.props.actions && this.props.actions.length) {
      var cellStyle = {
        lineHeight: this.props.height + 'px',
      };
      if (this.props.actionsOpen && !this.props.object.disabled) {
        var actions = [];
        for (var actionId = 0; actionId < this.props.actions.length; actionId++) {
          var action = this.props.actions[actionId];
          actions.push(
            <li
              key={'action-' + actionId}
              className="action"
              onClick={this.onActionClick}
              data-action={actionId}
            >
              {action.label}
            </li>
          );
        }
        cells.push(
          <td
            key="actions"
            ref="actions"
            className="actions open"
            style={cellStyle}
          >
            <i className="fa fa-bars" onClick={this.closeActions}></i>
            <ul className="actions">
              {actions}
            </ul>
          </td>
        );
      }
      else {
        cells.push(
          <td
            key="actions"
            ref="actions"
            className="actions closed"
            onClick={this.openActions.bind(this)}
            style={cellStyle}
          >
            <i className="fa fa-bars"></i>
          </td>
        );
      }
    }
    return (
      <tr
        className={classNames('', {disabled: (this.props.object.disabled == true)})}
        style={{
          height: '' + this.props.height + 'px',
        }}
      >
        {cells}
      </tr>
    );
  }
}
ObjectRow.defaultProps = {
  // columns: [], // from grid
  // rowHeight: 32, // from grid
};

module.exports = ObjectRow;
