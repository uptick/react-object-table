const React = require('react');
const JQuery = require('jquery');
const ClassNames = require('classnames');

const Utilities = require('./utilities.jsx');

const ObjectCell = require('./object-cell.jsx');

var ObjectRow = React.createClass({
  getDefaultProps: function() {
    return {
      // columns: [], // from grid
      // rowHeight: 32, // from grid
    };
  },
  getInitialState: function() {
    return {};
  },

  colInRanges: function(column, columns, rows) {
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
  },
  isEditing: function(column) {
    if (this.props.editing === null)
      return false;
    return (
      this.props.editing.columnKey == column.key
      && this.props.editing.objectId == this.props.object.id
    );
  },

  openActions: function(event) {
    this.props.openActions(this.props.object.id);
  },
  closeActions: function(event) {
    this.props.closeActions();
  },
  onActionClick: function(event) {
    var reactClass = this;
    var actionId = JQuery(event.target).data('action');
    var action = this.props.actions[actionId];
    if (action) {
      reactClass.props.actions[actionId].func(reactClass.props.object.id);
      if (!action.stayOpen)
        reactClass.props.closeActions();
    }
  },

  render: function() {
    var cells = [];
    for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
      var column = this.props.columns[columnIndex];
      var editing = false;
      if (this.props.editing !== null)
        editing = (this.props.editing.objectId == this.props.object.id && this.props.editing.columnKey == column.key);

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
        onDoubleClickCell: this.props.onDoubleClickCell,

        updateField: this.props.updateField,
        abortField: this.props.abortField,
      };
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
            onClick={this.openActions}
            style={cellStyle}
          >
            <i className="fa fa-bars"></i>
          </td>
        );
      }
    }
    return (
      <tr
        className={ClassNames('', {disabled: (this.props.object.disabled == true)})}
        style={{
          height: '' + this.props.height + 'px',
        }}
      >
        {cells}
      </tr>
    );
  },
});

module.exports = ObjectRow;
