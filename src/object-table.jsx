import React from 'react'
import ReactDom from 'react-dom'
import JQuery from 'jquery'
import ClassNames from 'classnames'
import Clone from 'clone'

import { dict_count, dict_first_key } from './utilities.js'
import { string_value, deserialize_cells } from './clipboard.js'
import TextEditor from './editors/text.jsx'
import TextDrawer from './drawers/text.jsx'

import ObjectRow from './object-row.jsx'
import BaseEditor from './base-editor.js'

var _iOSDevice = false;
if (typeof navigator !== 'undefined')
  _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);

class ObjectTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleMouseMove = ::this.handleMouseMove;
    this.handleKeyPress = ::this.handleKeyPress;
    this.handleKeyDown = ::this.handleKeyDown;
    this.handleMouseUp = ::this.handleMouseUp;

    this.updateField = ::this.updateField;
    this.abortField = ::this.abortField;
    this.openActions = ::this.openActions;
    this.closeActions = ::this.closeActions;
    this.handleMouseDownCell = ::this.handleMouseDownCell;
    this.beginEdit = ::this.beginEdit;

    this.state = {
      ...this.state,

      editing: null,
      editReplace: null,

      selectionDragStart: null,

      selectedRows: {},
      selectedColumns: {},
      selectedRowsDown: true,
      selectedColumnsRight: true,

      copyingRows: {},
      copyingColumns: {},

      openActions: null,
    };
  }

  componentDidMount() {
    JQuery(document).on('mousemove', this.handleMouseMove);
    JQuery(document).on('keypress', this.handleKeyPress);
    JQuery(document).on('keydown', this.handleKeyDown);
    JQuery(document).on('mouseup', (event) => {
      var parentContainer = JQuery(event.target).closest('.object-table-container');
      if (parentContainer.length == 1) {
        try {
          if (parentContainer[0] == ReactDom.findDOMNode(this))
            return;
        }
        catch( e ) {
        }
      }
      if (this.state.selectionDragStart === null)
        this.handleClickOutside(event);
    });
    JQuery(document).on('mouseup', this.handleMouseUp);
    JQuery(document).on('copy', (event) => {
      var theEvent = event;
      if (Object.keys(this.state.selectedColumns).length > 0 || Object.keys(this.state.selectedRows).length)
        this.handleCopy(theEvent);
    });
    JQuery(document).on('paste', (event) => {
      var theEvent = event;
      var clipboardObjects = deserialize_cells(theEvent.originalEvent.clipboardData);
      if (clipboardObjects.length) {
        this.handlePaste(clipboardObjects);
      }
    });
  }
  getEventCellRef(event) {
    var cell = JQuery(event.target);
    if (!cell.is('td'))
      cell = cell.closest('td');
    var objectId = cell.data('object-id');
    var columnKey = cell.data('column-key');
    return {
      objectId: objectId,
      columnKey: columnKey,
    };
  }
  getDraggedColumns(startX, endX, tableBounds) {
    var cols = {};

    var tableLeft = tableBounds.left + document.body.scrollLeft;

    var lowestX = startX;
    var highestX = endX;
    if (lowestX > highestX) {
      var tempX = lowestX;
      lowestX = highestX;
      highestX = tempX;
    }
    this.props.columns.map(column => {
      var colElem = this.refs['header-' + column.key];
      var colLeft = tableLeft + colElem.offsetLeft;
      var colRight = colLeft + colElem.offsetWidth;

      var inLeft = (colRight >= lowestX && colLeft <= highestX);
      var inRight = (colLeft <= highestX && colRight >= lowestX);
      if (inLeft || inRight)
        cols[column.key] = true;
    });

    return cols;
  }
  getDraggedRows(startY, endY, tableBounds) {
    var rows = {};

    var tableTop = tableBounds.top + document.body.scrollTop;

    var lowestY = startY;
    var highestY = endY;
    if (lowestY > highestY) {
      var tempY = lowestY;
      lowestY = highestY;
      highestY = tempY;
    }
    for (
      var rowIndex = 0;
      rowIndex < this.props.objects.length;
      rowIndex++
    ) {
      var object = this.props.objects[rowIndex];
      var rowElem = ReactDom.findDOMNode(this.refs['object-' + object.id]);
      if (!rowElem)
        continue;
      var rowTop = tableTop + rowElem.offsetTop;
      var rowBottom = rowTop + rowElem.offsetHeight;

      var inTop = (rowBottom >= lowestY && rowTop < highestY);
      var inBottom = (rowTop < highestY && rowBottom >= lowestY);
      if (inTop || inBottom)
        rows[object.id] = true;
    }

    return rows;
  }
  getSelectedFirstVisibleRow(reverse) {
    var allRows = Clone(this.props.objects || []);
    if (reverse)
      allRows = allRows.reverse();

    for (var rowIndex = 0; rowIndex < allRows.length; rowIndex++) {
      var row = allRows[rowIndex];
      if (typeof this.state.selectedRows[row.id] != 'undefined')
        return row.id;
    }
    return null;
  }
  getSelectedFirstVisibleColumn(reverse) {
    var allColumns = Clone(this.props.columns);
    if (reverse)
      allColumns = allColumns.reverse();

    for (var columnIndex = 0; columnIndex < allColumns.length; columnIndex++) {
      var column = allColumns[columnIndex];
      if (typeof this.state.selectedColumns[column.key] != 'undefined')
        return column.key
    }
    return null;
  }
  getSelectedNextVisibleRow(reverse) {
    var allRows = Clone(this.props.objects || []);
    if (reverse)
      allRows = allRows.reverse();

    var couldBeNext = false;
    var next = allRows.length ? allRows[0].id : null;

    for (var rowIndex = 0; rowIndex < allRows.length; rowIndex++) {
      var row = allRows[rowIndex];
      if (couldBeNext) {
        next = row.id;
        couldBeNext = false;
      }
      if (typeof this.state.selectedRows[row.id] != 'undefined') {
        next = row.id;
        couldBeNext = true;
      }
    }
    return next;
  }
  getSelectedNextVisibleColumn(reverse) {
    var allColumns = Clone(this.props.columns);
    if (reverse)
      allColumns = allColumns.reverse();

    var couldBeNext = false;
    var next = allColumns.length ? allColumns[0].id : null;

    for (var columnIndex = 0; columnIndex < allColumns.length; columnIndex++) {
      var column = allColumns[columnIndex];
      if (couldBeNext) {
        next = column.key;
        couldBeNext = false;
      }
      if (typeof this.state.selectedColumns[column.key] != 'undefined') {
        next = column.key;
        couldBeNext = true;
      }
    }
    return next;
  }

  getColumnFromKey(key) {
    const cols = this.props.columns || []
    return cols.find(col => col.key === key)
  }

  cellIsEditable(objectId, column) {
    if (typeof(column) === 'string'){
      column = this.getColumnFromKey(column)
    }
    if (column) {
      if (typeof(column.isReadOnly) === 'boolean') {
        return !column.isReadOnly
      } else if (typeof(column.isReadOnly) === 'function') {
        return !column.isReadOnly(objectId)
      }
      return true
    }
    return false
  }

  handleKeyPress(event) {
    if (this.state.editing === null) {
      var editRow = this.getSelectedFirstVisibleRow();
      var editColumn = this.getSelectedFirstVisibleColumn();
      if (editRow !== null && editColumn !== null) {
        var editObject;
        for (var objectIndex = 0; objectIndex < this.props.objects.length; objectIndex++) {
          var object = this.props.objects[objectIndex];
          if (object.id == editRow)
            editObject = object;
        }
        var keyPressed = event.key;
        // switch (keyPressed.toLowerCase()) {
        switch (event.which) {

          // case 'enter':
          case 13:
            if (this.cellIsEditable(editRow, editColumn) && editObject && !editObject.disabled) {
              this.setState(state => {
                state.editing = {
                  columnKey: editColumn,
                  objectId: editRow,
                };
                state.editReplace = null;
                return state;
              });
            }
            event.preventDefault();
            break;

          default:
            if (this.cellIsEditable(editRow, editColumn) && editObject && !editObject.disabled) {
              this.setState(state => {
                state.editing = {
                  columnKey: editColumn,
                  objectId: editRow,
                };
                var keyPressed = String.fromCharCode(event.which)
                state.editReplace = keyPressed;
                return state;
              });
            }
            event.preventDefault();
            break;
        }
      }
    }
  }
  handleKeyDown(event) {
    var reactClass = this;
    var directionKeys = {
      38: 'arrow_up',
      40: 'arrow_down',
      37: 'arrow_left',
      39: 'arrow_right',
    };
    var actionKeys = {
      27: 'escape',
      9: 'tab',
      8: 'backspace',
    };
    if (this.state.editing === null) {
      var selectedCells = Object.keys(this.state.selectedRows).length;
      selectedCells *= Object.keys(this.state.selectedColumns).length;
      if (selectedCells > 0) {
        switch (directionKeys[event.which]) {

          case 'arrow_up':
            if (event.shiftKey) {
              var newRows = Clone(this.state.selectedRows);
              if (Object.keys(this.state.selectedRows).length > 1 && this.state.selectedRowsDown)
                delete newRows[this.getSelectedFirstVisibleRow(true)];
              else
                newRows[this.getSelectedNextVisibleRow(true)] = true;
              this.changeSelectionTo(newRows, this.state.selectedColumns);
            } else {
              this.moveSelectionTo(
                this.getSelectedNextVisibleRow(true),
                this.getSelectedFirstVisibleColumn()
              );
            }
            break;

          case 'arrow_down':
            if (event.shiftKey) {
              var newRows = Clone(this.state.selectedRows);
              if (Object.keys(this.state.selectedRows).length > 1 && !this.state.selectedRowsDown)
                delete newRows[this.getSelectedFirstVisibleRow()];
              else
                newRows[this.getSelectedNextVisibleRow()] = true;
              this.changeSelectionTo(newRows, this.state.selectedColumns);
            } else {
              this.moveSelectionTo(
                this.getSelectedNextVisibleRow(),
                this.getSelectedFirstVisibleColumn()
              );
            }
            break;

          case 'arrow_left':
            if (event.shiftKey) {
              var newColumns = Clone(this.state.selectedColumns);
              if (Object.keys(this.state.selectedColumns).length > 1 && this.state.selectedColumnsRight)
                delete newColumns[this.getSelectedFirstVisibleColumn(true)];
              else
                newColumns[this.getSelectedNextVisibleColumn(true)] = true;
              this.changeSelectionTo(this.state.selectedRows, newColumns);
            } else {
              this.moveSelectionTo(
                this.getSelectedFirstVisibleRow(),
                this.getSelectedNextVisibleColumn(true)
              );
            }
            break;

          case 'arrow_right':
            if (event.shiftKey) {
              var newColumns = Clone(this.state.selectedColumns);
              if (Object.keys(this.state.selectedColumns).length > 1 && !this.state.selectedColumnsRight)
                delete newColumns[this.getSelectedFirstVisibleColumn()];
              else
                newColumns[this.getSelectedNextVisibleColumn()] = true;
              this.changeSelectionTo(this.state.selectedRows, newColumns);
            } else {
              this.moveSelectionTo(
                this.getSelectedFirstVisibleRow(),
                this.getSelectedNextVisibleColumn()
              );
            }
            break;


        }
        switch (actionKeys[event.which]) {

          case 'escape':
            if (Object.keys(this.state.copyingColumns).length > 0 || Object.keys(this.state.copyingRows).length > 0) {
              this.setState(state => {
                state.copyingColumns = {};
                state.copyingRows = {};
                return state;
              });
            }
            break;

          case 'backspace':
            var editColumn = reactClass.getSelectedFirstVisibleColumn();
            var editRow = reactClass.getSelectedFirstVisibleRow()
            if (selectedCells > 0 && reactClass.cellIsEditable(editRow, editColumn)) {
              this.setState(state => {
                state.editing = {
                  columnKey: editColumn,
                  objectId: editRow,
                };
                state.editReplace = '';
                return state;
              });
            }
            break;

          case 'tab':
            if (typeof this.state.selectedColumns[this.getSelectedNextVisibleColumn()] == 'undefined') {
              this.moveSelectionTo(
                this.getSelectedFirstVisibleRow(),
                this.getSelectedNextVisibleColumn()
              )
            }
            else {
              this.moveSelectionTo(
                this.getSelectedNextVisibleRow(),
                this.props.columns[0].key
              )
            }
            break;
        }
        if (typeof directionKeys[event.which] !== 'undefined' || typeof actionKeys[event.which] !== 'undefined')
          event.preventDefault();
      }
    }
  }
  handleClickOutside(event) {
    if (this.state.editing) {
      this.refs['object-' + this.state.editing.objectId].refs['column-' + this.state.editing.columnKey].refs.editor.handleBlur();
    }
    else if (Object.keys(this.state.selectedRows).length != 0 || Object.keys(this.state.selectedColumns).length != 0) {
      this.setState(state => {
        state.selectedRows = {};
        state.selectedColumns = {};
        return state;
      });
    }
    if (!JQuery(event.target).closest('ul.actions').length) {
      this.closeActions();
    }
  }
  beginEdit(ref, editReplaceOverride) {
    var editReplace = null;
    if (typeof editReplaceOverride !== 'undefined') {
      editReplace = editReplaceOverride;
    }
    this.setState(state => {
      state.editing = ref;
      state.editReplace = editReplaceOverride;
      return state;
    });
  }
  handleMouseDownCell(ref, clientX, clientY, shift) {
    if (_iOSDevice) {
      this.beginEdit(ref);
      return;
    }

    if (this.state.editing !== null) {
      this.handleClickOutside({});
      return;
    }

    var mouseX = clientX;
    var mouseY = clientY;
    var clickRef = ref;
    if (this.state.selectionDragStart === null) {
      if (shift) {
        var currentColumn = this.getSelectedFirstVisibleColumn(!this.state.selectedColumnsRight);
        var currentRow = this.getSelectedFirstVisibleRow(!this.state.selectedRowsDown);

        var selectingDown;
        var selectingRight;
        for (var rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
          var row = this.props.objects[rowIndex];
          if (row.id == currentRow) {
            selectingDown = true;
            break;
          }
          if (row.id == ref.objectId) {
            selectingDown = false;
            break;
          }
        }
        for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
          var column = this.props.columns[columnIndex];
          if (column.key == currentColumn) {
            selectingRight = true;
            break;
          }
          if (column.key == ref.columnKey) {
            selectingRight = false;
            break;
          }
        }

        var newSelectionRows = {};
        var selecting = false;
        for (var rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
          var row = this.props.objects[rowIndex];
          if ((selectingDown && row.id == currentRow) || (!selectingDown && row.id == ref.objectId))
            selecting = true;
          if (selecting)
            newSelectionRows[row.id] = true;
          if ((selectingDown && row.id == ref.objectId) || (!selectingDown && row.id == currentRow))
            break;
        }
        var newSelectionColumns = {};
        selecting = false;
        for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
          var column = this.props.columns[columnIndex];
          if ((selectingRight && column.key == currentColumn) || (!selectingRight && column.key == ref.columnKey))
            selecting = true;
          if (selecting)
            newSelectionColumns[column.key] = true;
          if ((selectingRight && column.key == ref.columnKey) || (!selectingRight && column.key == currentColumn))
            break;
        }

        this.setState(state => {
          state.selectedColumns = newSelectionColumns;
          state.selectedRows = newSelectionRows;
          state.selectedRowsDown = selectingDown;
          state.selectedColumnsRight = selectingRight;
          return state;
        });
      }
      else {
        this.setState(state => {
          state.selectionDragStart = {
            x: mouseX + document.body.scrollLeft,
            y: mouseY + document.body.scrollTop,
          };
          state.selectedRows = {};
          state.selectedRows[clickRef.objectId] = true;
          state.selectedColumns = {};
          state.selectedColumns[clickRef.columnKey] = true;
          return state;
        });
      }
    }

    this.closeActions();
  }
  handleMouseMove(event) {
    if (this.state.selectionDragStart !== null) {
      var mouseX = event.clientX + document.body.scrollLeft;
      var mouseY = event.clientY + document.body.scrollTop;
      this.setState(state => {
        var tableBounds = this.refs.table.getBoundingClientRect();
        state.selectedColumns = this.getDraggedColumns(state.selectionDragStart.x, mouseX, tableBounds);
        state.selectedRows = this.getDraggedRows(state.selectionDragStart.y, mouseY, tableBounds);
        state.selectedColumnsRight = true;
        state.selectedRowsDown = true;
        return state;
      });
    }
  }
  handleMouseUp(event) {
    if (this.state.selectionDragStart !== null) {
      var mouseX = event.clientX + document.body.scrollLeft;
      var mouseY = event.clientY + document.body.scrollTop;
      this.setState(state => {
        var tableBounds = this.refs.table.getBoundingClientRect();
        state.selectedColumnsRight = (state.selectionDragStart.x < mouseX);
        state.selectedRowsDown = (state.selectionDragStart.y < mouseY);
        state.selectedColumns = this.getDraggedColumns(state.selectionDragStart.x, mouseX, tableBounds);
        state.selectedRows = this.getDraggedRows(state.selectionDragStart.y, mouseY, tableBounds);
        state.selectionDragStart = null;
        return state;
      });
    }
  }
  handleCopy(event) {
    var clipboardData = event.originalEvent.clipboardData;
    if (clipboardData)
      clipboardData.clearData();
    var cellsData = [];
    for (var rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
      var row = this.props.objects[rowIndex];
      if (Object.keys(this.state.selectedRows).length > 0 && typeof this.state.selectedRows[row.id] == 'undefined')
        continue;
      var cellRow = [];
      for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
        var column = this.props.columns[columnIndex];
        if (Object.keys(this.state.selectedColumns).length > 0 && typeof this.state.selectedColumns[column.key] == 'undefined')
          continue;
        cellRow.push(row[column.key]);
      }
      cellsData.push(cellRow);
    }

    var stringData = '';
    var longestColumns = [];
    for (var rowIndex = 0; rowIndex < cellsData.length; rowIndex++) {
      for (var columnIndex = 0; columnIndex < cellsData[rowIndex].length; columnIndex++) {
        var stringVal = string_value(cellsData[rowIndex][columnIndex]);

        if (typeof longestColumns[columnIndex] == 'undefined' || longestColumns[columnIndex] < stringVal.length)
          longestColumns[columnIndex] = stringVal.length;
      }
    }
    for (var rowIndex = 0; rowIndex < cellsData.length; rowIndex++) {
      for (var columnIndex = 0; columnIndex < cellsData[rowIndex].length; columnIndex++) {
        var stringVal = string_value(cellsData[rowIndex][columnIndex]);
        stringData += stringVal;
        var numSpaces = longestColumns[columnIndex] - stringVal.length;
        if (columnIndex != (cellsData[rowIndex].length - 1))
          numSpaces += 1;
        for (var i = 0; i < numSpaces; i++)
          stringData += ' ';
      }
      stringData += '\n';
    }

    var csvData = '';
    for (var rowIndex = 0; rowIndex < cellsData.length; rowIndex++) {
      for (var columnIndex = 0; columnIndex < cellsData[rowIndex].length; columnIndex++) {
        var stringVal = string_value(cellsData[rowIndex][columnIndex]);
        // var wrapQuotes = (stringVal.indexOf(',') != -1);
        var wrapQuotes = false;
        if (wrapQuotes)
          csvData += '"';
        // csvData += stringVal.replace('"', '""');
        csvData += stringVal.replace('\t', ' ');
        if (wrapQuotes)
          csvData += '"';
        if (columnIndex != (cellsData[rowIndex].length - 1))
          csvData += '\t';
      }
      csvData += '\n';
    }

    clipboardData.setData('text/plain', csvData);
    clipboardData.setData('react/object-grid', JSON.stringify(cellsData));
    // clipboardData.setData('application/csv', csvData);
    event.preventDefault();
    this.setState(state => {
      state.copyingRows = state.selectedRows;
      state.copyingColumns = state.selectedColumns;
      return state;
    });
  }
  handlePaste(pasteData) {
    var reactClass = this;
    var raise_row_errors = function(errors, row) {
      var numErrors = Object.keys(errors).length;
      if (numErrors) {
        var message;
        if (numErrors > 1)
          message = 'Invalid values given for ';
        else
          message = 'Invalid value given for ';
        for (var columnKey in errors) {
          message += columnKey;
          message += ', ';
        }
        message = message.substring(0, message.length - 2);
        message += '.';
        reactClass.props.onRowError(row, message);
      }
    };

    // console.log('handling a paste of', pasteData);
    var numSelectedRows = Object.keys(reactClass.state.selectedRows).length;
    var numSelectedColumns = Object.keys(reactClass.state.selectedColumns).length;
    if (numSelectedRows == 1 && numSelectedColumns == 1) {
      var objectUpdates = [];

      var newSelectionColumns = {};
      var newSelectionRows = {};

      var pastingRow = false;
      var pastingRowIndex = 0;
      for (var rowIndex = 0; rowIndex < reactClass.props.objects.length; rowIndex++) {
        var row = reactClass.props.objects[rowIndex];
        if (!pastingRow && typeof reactClass.state.selectedRows[row.id] == 'undefined')
          continue;
        pastingRow = true;
        if (pastingRowIndex < pasteData.length) {
          newSelectionRows[row.id] = true;
          var pastingColumn = false;
          var pastingColumnIndex = 0;
          var updates = {};
          var errors = {};
          for (var columnIndex = 0; columnIndex < reactClass.props.columns.length; columnIndex++) {
            var column = reactClass.props.columns[columnIndex];
            if (!pastingColumn && typeof reactClass.state.selectedColumns[column.key] == 'undefined')
              continue;
            pastingColumn = true;
            if (pastingColumnIndex < pasteData[pastingRowIndex].length) {
              newSelectionColumns[column.key] = true;
              if (column.editor !== false && !row.disabled && this.cellIsEditable(row.id, column)) {
                var editor = column.editor || TextEditor;
                var validated = editor.validate(
                  pasteData[pastingRowIndex][pastingColumnIndex],
                  column.editorProps || {}
                );
                if (validated.valid)
                  updates[column.key] = validated.cleanedValue;
                else
                  errors[column.key] = true;
              }
              pastingColumnIndex++;
            }
          }
          if (Object.keys(updates).length)
            objectUpdates.push([row.id, updates]);
          raise_row_errors(errors, row);
          pastingRowIndex++;
        }
      }
      reactClass.updateManyObjects(objectUpdates);
      reactClass.changeSelectionTo(newSelectionRows, newSelectionColumns);
    } else {
      var objectUpdates = [];

      var pasteRow = 0;
      var pasteColumn = 0;
      for (var rowIndex = 0; rowIndex < reactClass.props.objects.length; rowIndex++) {
        var row = reactClass.props.objects[rowIndex];
        if (typeof reactClass.state.selectedRows[row.id] == 'undefined')
          continue;
        var updates = {};
        var errors = {};
        for (var columnIndex = 0; columnIndex < reactClass.props.columns.length; columnIndex++) {
          var column = reactClass.props.columns[columnIndex];
          if (typeof reactClass.state.selectedColumns[column.key] == 'undefined')
            continue;
          if (column.editor !== false && !row.disabled  && this.cellIsEditable(row.id, column)) {
            var editor = column.editor || TextEditor;
            var validated = editor.validate(
              pasteData[pasteRow][pasteColumn],
              column.editorProps || {}
            );
            if (validated.valid)
              updates[column.key] = validated.cleanedValue;
            else
              errors[column.key] = true;
          }
          pasteColumn++;
          if (pasteColumn >= pasteData[pasteRow].length)
            pasteColumn = 0;
        }
        pasteColumn = 0;
        if (Object.keys(updates).length)
          objectUpdates.push([row.id, updates]);
        raise_row_errors(errors, row);
        pasteRow++;
        if (pasteRow >= pasteData.length)
          pasteRow = 0;
      }

      reactClass.updateManyObjects(objectUpdates);
    }
    reactClass.setState(state => {
      state.copyingColumns = {};
      state.copyingRows = {};
      return state;
    });
  }

  abortField(action) {
    this.setState(state => {
      state.editing = null;
      return state;
    });
  }
  updateField(objectId, columnKey, newValue, action) {
    var reactClass = this;

    var updates = {};
    updates[columnKey] = newValue;
    this.updateObject(objectId, updates);

    var updateAction = action;
    reactClass.setState(state => {
      state.editing = null;
      if (dict_count(state.selectedRows) == 1 && dict_count(state.selectedColumns) == 1) {
        switch (updateAction) {

          case 'nextRow':
            state.selectedRows = {};
            state.selectedRows[this.getSelectedNextVisibleRow()] = true;
            break;

          case 'nextColumn':
            state.selectedColumns = {};
            state.selectedColumns[this.getSelectedNextVisibleColumn()] = true;
            break;
        }
      }
      return state;
    });
  }
  updateManyObjects(updates) {
    if (typeof this.props.onUpdateMany == 'function')
      this.props.onUpdateMany(updates);
    else {
      for (var updateId = 0; updateId < updates.length; updateId++) {
        var update = updates[updateId];
        this.updateObject(update[0], update[1]);
      }
    }
  }
  updateObject(objectId, updates) {
    if (typeof this.props.onUpdate == 'function') {
      this.props.onUpdate(objectId, updates);
    }
    else {
      console.log('If I had a props.onUpdate, I would update object', objectId, 'with', updates);
    }
  }
  openActions(id) {
    this.setState(state => {
      state.openActions = id;
      return state;
    });
  }
  closeActions() {
    if (this.state.openActions === null)
      return;
    this.setState(state => {
      state.openActions = null;
      return state;
    });
  }

  moveSelectionTo(row, column) {
    var newRows = {};
    var newColumns = {};
    newRows[row] = true;
    newColumns[column] = true;
    this.changeSelectionTo(newRows, newColumns);
  }
  changeSelectionTo(rows, columns) {
    var newRows = rows;
    var newColumns = columns;

    var down;
    if (Object.keys(this.state.selectedRows).length == 1 && Object.keys(newRows).length > 1) {
      down = false;
      var oldRow = dict_first_key(this.state.selectedRows);
      for (var rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
        var row = this.props.objects[rowIndex];
        if (row.id == oldRow) {
          down = true;
          break;
        }
        if (typeof newRows[row.id] !== 'undefined')
          break;
      }
    }
    if (Object.keys(newRows).length <= 1)
      down = true;

    var right;
    if (Object.keys(this.state.selectedColumns).length == 1 && Object.keys(newColumns).length > 1) {
      right = false;
      var oldColumn = dict_first_key(this.state.selectedColumns);
      for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
        var column = this.props.columns[columnIndex];
        if (column.key == oldColumn) {
          right = true;
          break;
        }
        if (typeof newColumns[column.key] !== 'undefined')
          break;
      }
    }
    if (Object.keys(newColumns).length <= 1)
      right = true;

    this.setState(state => {
      if (typeof down !== 'undefined')
        state.selectedRowsDown = down;
      if (typeof right !== 'undefined')
        state.selectedColumnsRight = right;
      state.selectedRows = newRows;
      state.selectedColumns = newColumns;
      return state;
    });
  }

  renderHeaders() {
    var columns = [];
    this.props.columns.map((column) => {
      var headerProps = {
        ref: `header-${column.key}`,
        key: `header-${column.key}`,
        style: {
          height: `${this.props.rowHeight}px`,
        },
      };
      if (column.width)
        headerProps.width = column.width;
      columns.push(
        <th
          className={ClassNames(column.headerClassName || '')}
          {...headerProps}
        >
          {column.name}
        </th>
      );
    });

    if (this.props.actions && this.props.actions.length) {
      columns.push(
        <th
          ref="actions"
          key="actions"
          className="actions"
          width={25}
        >
        </th>
      );
    }

    return (
      <tr>{columns}</tr>
    );
  }
  renderRows() {
    var numSelectedRows = Object.keys(this.state.selectedRows).length;
    var numCopyingRows = Object.keys(this.state.copyingRows).length;
    var rows = [];

    var reactClass = this;

    this.props.objects.map(function(object) {
      var ref = `object-${object.id}`;

      var selectedColumns = {};
      if (numSelectedRows == 0 || typeof reactClass.state.selectedRows[object.id] !== 'undefined')
        selectedColumns = reactClass.state.selectedColumns;
      var copyingColumns = {};
      if (numCopyingRows == 0 || typeof reactClass.state.copyingRows[object.id] !== 'undefined')
        copyingColumns = reactClass.state.copyingColumns;

      var editing = null;
      if (reactClass.state.editing !== null && reactClass.state.editing.objectId === object.id) {
        editing = reactClass.state.editing;
      }

      rows.push(
        <ObjectRow
          ref={ref}
          key={ref}
          object={object}

          height={reactClass.props.rowHeight}
          columns={reactClass.props.columns}
          editing={editing}
          editReplace={editing === null ? null : reactClass.state.editReplace}
          selectedColumns={selectedColumns}
          copyingColumns={copyingColumns}
          actions={reactClass.props.actions}
          actionsOpen={object.id === reactClass.state.openActions}

          updateField={reactClass.updateField}
          abortField={reactClass.abortField}
          cellError={reactClass.props.onCellError}
          openActions={reactClass.openActions}
          closeActions={reactClass.closeActions}

          onMouseDownCell={reactClass.handleMouseDownCell}
          beginEdit={reactClass.beginEdit}
        />
      );
    });

    if (!rows.length) {
      var numColumns = this.props.columns.length;
      if (this.props.actions && this.props.actions.length)
        numColumns += 1;
      return (
        <tr style={{height: this.props.rowHeight}}>
          <td colSpan={numColumns} className="empty">
            {this.props.emptyText}
          </td>
        </tr>
      );
    }
    return rows;
  }
  render() {
    var classes = ClassNames('', {
      'editing': (this.state.editing !== null),
    });
    return (
      <div className="object-table-container">
        <table
          ref="table"
          tabIndex="1"
          className={classes}
        >
          <thead>
            {this.renderHeaders()}
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

ObjectTable.defaultProps = {
  rowHeight: 32,
  objects: [
    {
      id: 1,  // every object is expected to have a unique identifier
      name: 'Product item report',
      quantity: '1.0000',
    },
  ],
  columns: [
    {
      name: 'Description',
      key: 'description',
      width: 'auto',
      drawer: null,
      drawerProps: null,
      editor: null,
      editorProps: null,
    },
  ],
  emptyText: 'No objects',
  onRowError: function(row, message) {
    console.warn('Unable to update row:', row);
    console.warn('As the following error was encountered:', message);
  },
  onCellError: function(objectId, columnKey, message) {
    console.warn('Unable to update row ' + objectId + ' ' + columnKey);
    console.warn('As the following error was encountered:', message);
  },
};

export default ObjectTable
export { BaseEditor, TextEditor, TextDrawer }
