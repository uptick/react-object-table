var React = require('react');

var Utilities = require('./utilities.jsx');

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

  render: function() {
    var cells = [];
    for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
      var column = this.props.columns[columnIndex];
      var editing = false;
      if (this.props.editing !== null)
        editing = (this.props.editing.objectId == this.props.object.id && this.props.editing.columnKey == column.key);

      var ref = 'column-' + column.key;
      cells.push(
        <ObjectCell
          key={ref}
          ref={ref}

          value={this.props.object[column.key]}
          objectId={this.props.object.id}

          column={column}
          height={this.props.height}
          editReplace={this.props.editReplace}
          selected={(typeof this.props.selectedColumns[column.key] != 'undefined')}
          copying={(typeof this.props.copyingColumns[column.key] != 'undefined')}
          editing={editing}

          updateField={this.props.updateField}
          abortField={this.props.abortField}

          onMouseDownCell={this.props.onMouseDownCell}
          onDoubleClickCell={this.props.onDoubleClickCell}
        />
      );
    }
    return (
      <tr
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
