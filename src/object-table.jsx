import PropTypes from 'prop-types'
import React from 'react'
import ReactDom from 'react-dom'
import JQuery from 'jquery'
import ClassNames from 'classnames'
import Clone from 'clone'

import { dictCount, dictFirstKey, cellIsEditable } from './utilities.js'
import { stringValue, deserializeCells } from './clipboard.js'
import TextEditor from './editors/text.jsx'
import TextDrawer from './drawers/text.jsx'

import BaseEditor from './base-editor.js'
import ObjectCell from './object-cell.jsx'
import ObjectRow from './object-row.jsx'

let _iOSDevice = false
if (typeof navigator !== 'undefined') {
  _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/)
}

class ObjectTable extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.array,
    objects: PropTypes.array,
    onUpdateMany: PropTypes.func,
    onUpdate: PropTypes.func,
    rowHeight: PropTypes.number,
    actions: PropTypes.array,
    emptyText: PropTypes.string,
    onRowError: PropTypes.func,
    onCellError: PropTypes.func,
    rowComponent: PropTypes.func,
    rowProps: PropTypes.object,
    cellComponent: PropTypes.func,
    cellProps: PropTypes.object,
  }

  static defaultProps = {
    rowComponent: ObjectRow,
    cellComponent: ObjectCell,
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
      console.warn('Unable to update row:', row)
      console.warn('As the following error was encountered:', message)
    },
    onCellError: function(objectId, columnKey, message) {
      console.warn('Unable to update row ' + objectId + ' ' + columnKey)
      console.warn('As the following error was encountered:', message)
    },
  }

  state = {
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
  }

  componentDidMount() {
    JQuery(document).on('mousemove', this.handleMouseMove)
    JQuery(document).on('keypress', this.handleKeyPress)
    JQuery(document).on('keydown', this.handleKeyDown)
    JQuery(document).on('mouseup', (event) => {
      let parentContainer = JQuery(event.target).closest('.object-table-container')
      if (parentContainer.length === 1) {
        try {
          if (parentContainer[0] === ReactDom.findDOMNode(this)) return
        } catch (error) {}
      }
      if (this.state.selectionDragStart === null) {
        this.handleClickOutside(event)
      }
    })
    JQuery(document).on('mouseup', this.handleMouseUp)
    JQuery(document).on('copy', (event) => {
      let theEvent = event
      if (Object.keys(this.state.selectedColumns).length > 0 || Object.keys(this.state.selectedRows).length) {
        this.handleCopy(theEvent)
      }
    })
    JQuery(document).on('paste', (event) => {
      let theEvent = event
      let clipboardObjects = deserializeCells(theEvent.originalEvent.clipboardData)
      if (clipboardObjects.length) {
        this.handlePaste(clipboardObjects)
      }
    })
  }
  getEventCellRef(event) {
    let cell = JQuery(event.target)
    if (!cell.is('td')) cell = cell.closest('td')
    let objectId = cell.data('object-id')
    let columnKey = cell.data('column-key')
    return {
      objectId: objectId,
      columnKey: columnKey,
    }
  }
  getDraggedColumns(startX, endX, tableBounds) {
    let cols = {}

    let tableLeft = tableBounds.left + document.body.scrollLeft

    let lowestX = startX
    let highestX = endX
    if (lowestX > highestX) {
      let tempX = lowestX
      lowestX = highestX
      highestX = tempX
    }
    this.props.columns.map(column => {
      let colElem = this.refs['header-' + column.key]
      let colLeft = tableLeft + colElem.offsetLeft
      let colRight = colLeft + colElem.offsetWidth

      let inLeft = (colRight >= lowestX && colLeft <= highestX)
      let inRight = (colLeft <= highestX && colRight >= lowestX)
      if (inLeft || inRight) cols[column.key] = true
    })

    return cols
  }
  getDraggedRows(startY, endY, tableBounds) {
    let rows = {}

    let tableTop = tableBounds.top + document.body.scrollTop

    let lowestY = startY
    let highestY = endY
    if (lowestY > highestY) {
      let tempY = lowestY
      lowestY = highestY
      highestY = tempY
    }
    for (let rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
      let object = this.props.objects[rowIndex]
      let rowElem = ReactDom.findDOMNode(this.getRowFromRefs(object.id))
      if (!rowElem) {
        continue
      }
      let rowTop = tableTop + rowElem.offsetTop
      let rowBottom = rowTop + rowElem.offsetHeight

      let inTop = (rowBottom >= lowestY && rowTop < highestY)
      let inBottom = (rowTop < highestY && rowBottom >= lowestY)
      if (inTop || inBottom) rows[object.id] = true
    }

    return rows
  }
  getSelectedFirstVisibleRow(reverse) {
    let allRows = Clone(this.props.objects || [])
    if (reverse) allRows = allRows.reverse()

    for (let rowIndex = 0; rowIndex < allRows.length; rowIndex++) {
      let row = allRows[rowIndex]
      if (typeof this.state.selectedRows[row.id] !== 'undefined') {
        return row.id
      }
    }
    return null
  }
  getSelectedFirstVisibleColumn(reverse) {
    let allColumns = Clone(this.props.columns)
    if (reverse) allColumns = allColumns.reverse()

    for (let columnIndex = 0; columnIndex < allColumns.length; columnIndex++) {
      let column = allColumns[columnIndex]
      if (typeof this.state.selectedColumns[column.key] !== 'undefined') {
        return column.key
      }
    }
    return null
  }
  getSelectedNextVisibleRow(reverse) {
    let allRows = Clone(this.props.objects || [])
    if (reverse) allRows = allRows.reverse()

    let couldBeNext = false
    let next = allRows.length ? allRows[0].id : null

    for (let rowIndex = 0; rowIndex < allRows.length; rowIndex++) {
      let row = allRows[rowIndex]
      if (couldBeNext) {
        next = row.id
        couldBeNext = false
      }
      if (typeof this.state.selectedRows[row.id] !== 'undefined') {
        next = row.id
        couldBeNext = true
      }
    }
    return next
  }
  getSelectedNextVisibleColumn(reverse) {
    let allColumns = Clone(this.props.columns)
    if (reverse) allColumns = allColumns.reverse()

    let couldBeNext = false
    let next = allColumns.length ? allColumns[0].id : null

    for (let columnIndex = 0; columnIndex < allColumns.length; columnIndex++) {
      let column = allColumns[columnIndex]
      if (couldBeNext) {
        next = column.key
        couldBeNext = false
      }
      if (typeof this.state.selectedColumns[column.key] !== 'undefined') {
        next = column.key
        couldBeNext = true
      }
    }
    return next
  }

  getRowFromRefs(rowId) {
    // Dumb hack to clean up existing hack.
    let row = this.refs[`object-${rowId}`]
    // Unwrap
    while (row.decoratedComponentInstance) {
      row = row.decoratedComponentInstance
    }
    return row
  }

  getCellFromRefs(rowId, columnKey) {
    // Dumb hack to clean up existing hack.
    let cell = this.getRowFromRefs(rowId).refs[`column-${columnKey}`]
    // Unwrap
    while (cell.decoratedComponentInstance) {
      cell = cell.decoratedComponentInstance
    }
    return cell
  }

  getColumnFromKey(key) {
    const cols = this.props.columns || []
    return cols.find(col => col.key === key)
  }

  handleKeyPress = (event) => {
    if (this.state.editing === null) {
      let editRow = this.getSelectedFirstVisibleRow()
      let editColumn = this.getSelectedFirstVisibleColumn()
      if (editRow !== null && editColumn !== null) {
        let editObject
        for (let objectIndex = 0; objectIndex < this.props.objects.length; objectIndex++) {
          let object = this.props.objects[objectIndex]
          if (object.id === editRow) editObject = object
        }
        switch (event.which) {
          // case 'enter':
          case 13:
            if (cellIsEditable(editRow, this.getColumnFromKey(editColumn)) && editObject && !editObject.disabled) {
              this.setState({
                editing: {
                  columnKey: editColumn,
                  objectId: editRow,
                },
                editReplace: null,
              })
            }
            event.preventDefault()
            break

          default:
            if (cellIsEditable(editRow, this.getColumnFromKey(editColumn)) && editObject && !editObject.disabled) {
              this.setState({
                editing: {
                  columnKey: editColumn,
                  objectId: editRow,
                },
                editReplace: String.fromCharCode(event.which), // keyPressed
              })
            }
            event.preventDefault()
            break
        }
      }
    }
  }
  handleKeyDown = (event) => {
    let directionKeys = {
      38: 'arrow_up',
      40: 'arrow_down',
      37: 'arrow_left',
      39: 'arrow_right',
    }
    let actionKeys = {
      27: 'escape',
      9: 'tab',
      8: 'backspace',
    }
    if (this.state.editing === null) {
      let selectedCells = Object.keys(this.state.selectedRows).length
      selectedCells *= Object.keys(this.state.selectedColumns).length
      if (selectedCells > 0) {
        switch (directionKeys[event.which]) {
          case 'arrow_up':
            if (event.shiftKey) {
              let newRows = Clone(this.state.selectedRows)
              if (Object.keys(this.state.selectedRows).length > 1 && this.state.selectedRowsDown) {
                delete newRows[this.getSelectedFirstVisibleRow(true)]
              } else {
                newRows[this.getSelectedNextVisibleRow(true)] = true
              }
              this.changeSelectionTo(newRows, this.state.selectedColumns)
            } else {
              this.moveSelectionTo(
                this.getSelectedNextVisibleRow(true),
                this.getSelectedFirstVisibleColumn()
              )
            }
            break

          case 'arrow_down':
            if (event.shiftKey) {
              let newRows = Clone(this.state.selectedRows)
              if (Object.keys(this.state.selectedRows).length > 1 && !this.state.selectedRowsDown) {
                delete newRows[this.getSelectedFirstVisibleRow()]
              } else {
                newRows[this.getSelectedNextVisibleRow()] = true
              }
              this.changeSelectionTo(newRows, this.state.selectedColumns)
            } else {
              this.moveSelectionTo(
                this.getSelectedNextVisibleRow(),
                this.getSelectedFirstVisibleColumn()
              )
            }
            break

          case 'arrow_left':
            if (event.shiftKey) {
              let newColumns = Clone(this.state.selectedColumns)
              if (Object.keys(this.state.selectedColumns).length > 1 && this.state.selectedColumnsRight) {
                delete newColumns[this.getSelectedFirstVisibleColumn(true)]
              } else {
                newColumns[this.getSelectedNextVisibleColumn(true)] = true
              }
              this.changeSelectionTo(this.state.selectedRows, newColumns)
            } else {
              this.moveSelectionTo(
                this.getSelectedFirstVisibleRow(),
                this.getSelectedNextVisibleColumn(true)
              )
            }
            break

          case 'arrow_right':
            if (event.shiftKey) {
              let newColumns = Clone(this.state.selectedColumns)
              if (Object.keys(this.state.selectedColumns).length > 1 && !this.state.selectedColumnsRight) {
                delete newColumns[this.getSelectedFirstVisibleColumn()]
              } else {
                newColumns[this.getSelectedNextVisibleColumn()] = true
              }
              this.changeSelectionTo(this.state.selectedRows, newColumns)
            } else {
              this.moveSelectionTo(
                this.getSelectedFirstVisibleRow(),
                this.getSelectedNextVisibleColumn()
              )
            }
            break
        }
        switch (actionKeys[event.which]) {
          case 'escape':
            if (Object.keys(this.state.copyingColumns).length > 0 || Object.keys(this.state.copyingRows).length > 0) {
              this.setState({
                copyingColumns: {},
                copyingRows: {},
              })
            }
            break

          case 'backspace':
            let editColumn = this.getSelectedFirstVisibleColumn()
            let editRow = this.getSelectedFirstVisibleRow()
            if (selectedCells > 0 && cellIsEditable(editRow, this.getColumnFromKey(editColumn))) {
              this.setState({
                editing: {
                  columnKey: editColumn,
                  objectId: editRow,
                },
                editReplace: '',
              })
            }
            break

          case 'tab':
            if (typeof this.state.selectedColumns[this.getSelectedNextVisibleColumn()] === 'undefined') {
              this.moveSelectionTo(
                this.getSelectedFirstVisibleRow(),
                this.getSelectedNextVisibleColumn()
              )
            } else {
              this.moveSelectionTo(
                this.getSelectedNextVisibleRow(),
                this.props.columns[0].key
              )
            }
            break
        }
        if (typeof directionKeys[event.which] !== 'undefined' || typeof actionKeys[event.which] !== 'undefined') {
          event.preventDefault()
        }
      }
    }
  }
  handleClickOutside(event) {
    if (this.state.editing) {
      this.getCellFromRefs(this.state.editing.objectId, this.state.editing.columnKey).editor.handleBlur()
    } else if (Object.keys(this.state.selectedRows).length !== 0 || Object.keys(this.state.selectedColumns).length !== 0) {
      this.setState({selectedRows: {}, selectedColumns: {}})
    }
    if (!JQuery(event.target).closest('ul.actions').length) {
      this.closeActions()
    }
  }
  beginEdit = (ref, editReplaceOverride) => {
    let editReplace = null
    if (typeof editReplaceOverride !== 'undefined') {
      editReplace = editReplaceOverride
    }
    this.setState({editing: ref, editReplace: editReplace})
  }
  handleMouseDownCell = (ref, clientX, clientY, shift) => {
    if (_iOSDevice) {
      this.beginEdit(ref)
      return
    }

    if (this.state.editing !== null) {
      this.handleClickOutside({})
      return
    }

    let mouseX = clientX
    let mouseY = clientY
    let clickRef = ref
    if (this.state.selectionDragStart === null) {
      if (shift) {
        let currentColumn = this.getSelectedFirstVisibleColumn(!this.state.selectedColumnsRight)
        let currentRow = this.getSelectedFirstVisibleRow(!this.state.selectedRowsDown)

        let selectingDown
        let selectingRight
        for (let rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
          let row = this.props.objects[rowIndex]
          if (row.id === currentRow) {
            selectingDown = true
            break
          }
          if (row.id === ref.objectId) {
            selectingDown = false
            break
          }
        }
        for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
          let column = this.props.columns[columnIndex]
          if (column.key === currentColumn) {
            selectingRight = true
            break
          }
          if (column.key === ref.columnKey) {
            selectingRight = false
            break
          }
        }

        let newSelectionRows = {}
        let selecting = false
        for (let rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
          let row = this.props.objects[rowIndex]
          if ((selectingDown && row.id === currentRow) || (!selectingDown && row.id === ref.objectId)) {
            selecting = true
          }
          if (selecting) newSelectionRows[row.id] = true
          if ((selectingDown && row.id === ref.objectId) || (!selectingDown && row.id === currentRow)) {
            break
          }
        }
        let newSelectionColumns = {}
        selecting = false
        for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
          let column = this.props.columns[columnIndex]
          if ((selectingRight && column.key === currentColumn) || (!selectingRight && column.key === ref.columnKey)) {
            selecting = true
          }
          if (selecting) newSelectionColumns[column.key] = true
          if ((selectingRight && column.key === ref.columnKey) || (!selectingRight && column.key === currentColumn)) {
            break
          }
        }

        this.setState({
          selectedColumns: newSelectionColumns,
          selectedRows: newSelectionRows,
          selectedRowsDown: selectingDown,
          selectedColumnsRight: selectingRight,
        })
      } else {
        this.setState(prevState => {
          const stateChanges = {
            selectionDragStart: {
              x: mouseX + document.body.scrollLeft,
              y: mouseY + document.body.scrollTop,
            },
            selectedRows: prevState.selectedRows,
            selectedColumns: prevState.selectedColumns,
          }
          stateChanges.selectedRows[clickRef.objectId] = true
          stateChanges.selectedColumns[clickRef.columnKey] = true
          return stateChanges
        })
      }
    }

    this.closeActions()
  }
  handleMouseMove = (event) => {
    if (this.state.selectionDragStart !== null) {
      let mouseX = event.clientX + document.body.scrollLeft
      let mouseY = event.clientY + document.body.scrollTop
      this.setState(prevState => {
        let tableBounds = this.table.getBoundingClientRect()
        return {
          selectedColumns: this.getDraggedColumns(prevState.selectionDragStart.x, mouseX, tableBounds),
          selectedRows: this.getDraggedRows(prevState.selectionDragStart.y, mouseY, tableBounds),
          selectedColumnsRight: true,
          selectedRowsDown: true,
        }
      })
    }
  }
  handleMouseUp = (event) => {
    if (this.state.selectionDragStart !== null) {
      let mouseX = event.clientX + document.body.scrollLeft
      let mouseY = event.clientY + document.body.scrollTop
      this.setState(prevState => {
        let tableBounds = this.table.getBoundingClientRect()
        return {
          selectedColumnsRight: (prevState.selectionDragStart.x < mouseX),
          selectedRowsDown: (prevState.selectionDragStart.y < mouseY),
          selectedColumns: this.getDraggedColumns(prevState.selectionDragStart.x, mouseX, tableBounds),
          selectedRows: this.getDraggedRows(prevState.selectionDragStart.y, mouseY, tableBounds),
          selectionDragStart: null,
        }
      })
    }
  }
  handleCopy(event) {
    let clipboardData = event.originalEvent.clipboardData
    if (clipboardData) clipboardData.clearData()
    let cellsData = []
    for (let rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
      let row = this.props.objects[rowIndex]
      if (Object.keys(this.state.selectedRows).length > 0 && typeof this.state.selectedRows[row.id] === 'undefined') {
        continue
      }
      let cellRow = []
      for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
        let column = this.props.columns[columnIndex]
        if (Object.keys(this.state.selectedColumns).length > 0 && typeof this.state.selectedColumns[column.key] === 'undefined') {
          continue
        }
        cellRow.push(row[column.key])
      }
      cellsData.push(cellRow)
    }

    let longestColumns = []
    for (let rowIndex = 0; rowIndex < cellsData.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < cellsData[rowIndex].length; columnIndex++) {
        let stringVal = stringValue(cellsData[rowIndex][columnIndex])

        if (typeof longestColumns[columnIndex] === 'undefined' || longestColumns[columnIndex] < stringVal.length) {
          longestColumns[columnIndex] = stringVal.length
        }
      }
    }

    let csvData = ''
    for (let rowIndex = 0; rowIndex < cellsData.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < cellsData[rowIndex].length; columnIndex++) {
        let stringVal = stringValue(cellsData[rowIndex][columnIndex])
        // let wrapQuotes = (stringVal.indexOf(',') != -1)
        let wrapQuotes = false
        if (wrapQuotes) csvData += '"'
        csvData += stringVal.replace('\t', ' ')
        if (wrapQuotes) csvData += '"'
        if (columnIndex !== (cellsData[rowIndex].length - 1)) csvData += '\t'
      }
      csvData += '\n'
    }

    clipboardData.setData('text/plain', csvData)
    clipboardData.setData('react/object-grid', JSON.stringify(cellsData))
    // clipboardData.setData('application/csv', csvData)
    event.preventDefault()
    this.setState(prevState => ({
      copyingRows: prevState.selectedRows,
      copyingColumns: prevState.selectedColumns,
    }))
  }
  handlePaste(pasteData) {
    let raiseRowErrors = (errors, row) => {
      let numErrors = Object.keys(errors).length
      if (numErrors) {
        let message
        if (numErrors > 1) {
          message = 'Invalid values given for '
        } else {
          message = 'Invalid value given for '
        }
        for (let columnKey in errors) {
          message += columnKey
          message += ', '
        }
        message = message.substring(0, message.length - 2)
        message += '.'
        this.props.onRowError(row, message)
      }
    }

    // console.log('handling a paste of', pasteData)
    let numSelectedRows = Object.keys(this.state.selectedRows).length
    let numSelectedColumns = Object.keys(this.state.selectedColumns).length
    if (numSelectedRows === 1 && numSelectedColumns === 1) {
      let objectUpdates = []

      let newSelectionColumns = {}
      let newSelectionRows = {}

      let pastingRow = false
      let pastingRowIndex = 0
      for (let rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
        let row = this.props.objects[rowIndex]
        if (!pastingRow && typeof this.state.selectedRows[row.id] === 'undefined') {
          continue
        }
        pastingRow = true
        if (pastingRowIndex < pasteData.length) {
          newSelectionRows[row.id] = true
          let pastingColumn = false
          let pastingColumnIndex = 0
          let updates = {}
          let errors = {}
          for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
            let column = this.props.columns[columnIndex]
            if (!pastingColumn && typeof this.state.selectedColumns[column.key] === 'undefined') {
              continue
            }
            pastingColumn = true
            if (pastingColumnIndex < pasteData[pastingRowIndex].length) {
              newSelectionColumns[column.key] = true
              if (!row.disabled && cellIsEditable(row.id, column)) {
                let editor = column.editor || TextEditor
                let validated = editor.validate(
                  pasteData[pastingRowIndex][pastingColumnIndex],
                  column.editorProps || {}
                )
                if (validated.valid) {
                  updates[column.key] = validated.cleanedValue
                } else {
                  errors[column.key] = true
                }
              }
              pastingColumnIndex++
            }
          }
          if (Object.keys(updates).length) {
            objectUpdates.push([row.id, updates])
          }
          raiseRowErrors(errors, row)
          pastingRowIndex++
        }
      }
      this.updateManyObjects(objectUpdates)
      this.changeSelectionTo(newSelectionRows, newSelectionColumns)
    } else {
      let objectUpdates = []

      let pasteRow = 0
      let pasteColumn = 0
      for (let rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
        let row = this.props.objects[rowIndex]
        if (typeof this.state.selectedRows[row.id] === 'undefined') {
          continue
        }
        let updates = {}
        let errors = {}
        for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
          let column = this.props.columns[columnIndex]
          if (typeof this.state.selectedColumns[column.key] === 'undefined') {
            continue
          }
          if (!row.disabled && cellIsEditable(row.id, column)) {
            let editor = column.editor || TextEditor
            let validated = editor.validate(
              pasteData[pasteRow][pasteColumn],
              column.editorProps || {}
            )
            if (validated.valid) {
              updates[column.key] = validated.cleanedValue
            } else {
              errors[column.key] = true
            }
          }
          pasteColumn++
          if (pasteColumn >= pasteData[pasteRow].length) pasteColumn = 0
        }
        pasteColumn = 0
        if (Object.keys(updates).length) {
          objectUpdates.push([row.id, updates])
        }
        raiseRowErrors(errors, row)
        pasteRow++
        if (pasteRow >= pasteData.length) pasteRow = 0
      }

      this.updateManyObjects(objectUpdates)
    }
    this.setState({copyingColumns: {}, copyingRows: {}})
  }

  abortField = (action) => {
    this.setState({editing: null})
  }
  updateField = (objectId, columnKey, newValue, action) => {
    let updates = {}
    updates[columnKey] = newValue
    this.updateObject(objectId, updates)

    let updateAction = action
    this.setState(prevState => {
      const stateChanges = {editing: null}
      if (dictCount(prevState.selectedRows) === 1 && dictCount(prevState.selectedColumns) === 1) {
        switch (updateAction) {
          case 'nextRow':
            stateChanges.selectedRows = {}
            stateChanges.selectedRows[this.getSelectedNextVisibleRow()] = true
            break

          case 'nextColumn':
            stateChanges.selectedColumns = {}
            stateChanges.selectedColumns[this.getSelectedNextVisibleColumn()] = true
            break
        }
      }
      return stateChanges
    })
  }
  updateManyObjects(updates) {
    if (typeof this.props.onUpdateMany === 'function') {
      this.props.onUpdateMany(updates)
    } else {
      for (let updateId = 0; updateId < updates.length; updateId++) {
        let update = updates[updateId]
        this.updateObject(update[0], update[1])
      }
    }
  }
  updateObject(objectId, updates) {
    if (typeof this.props.onUpdate === 'function') {
      this.props.onUpdate(objectId, updates)
    } else {
      console.log('If I had a props.onUpdate, I would update object', objectId, 'with', updates)
    }
  }
  openActions = (id) => {
    this.setState({openActions: id})
  }
  closeActions = () => {
    if (this.state.openActions === null) {
      return
    }
    this.setState({openActions: null})
  }

  moveSelectionTo(row, column) {
    let newRows = {}
    let newColumns = {}
    newRows[row] = true
    newColumns[column] = true
    this.changeSelectionTo(newRows, newColumns)
  }
  changeSelectionTo(rows, columns) {
    let newRows = rows
    let newColumns = columns

    let down
    if (Object.keys(this.state.selectedRows).length === 1 && Object.keys(newRows).length > 1) {
      down = false
      let oldRow = dictFirstKey(this.state.selectedRows)
      for (let rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
        let row = this.props.objects[rowIndex]
        if (row.id === oldRow) {
          down = true
          break
        }
        if (typeof newRows[row.id] !== 'undefined') {
          break
        }
      }
    }
    if (Object.keys(newRows).length <= 1) {
      down = true
    }

    let right
    if (Object.keys(this.state.selectedColumns).length === 1 && Object.keys(newColumns).length > 1) {
      right = false
      let oldColumn = dictFirstKey(this.state.selectedColumns)
      for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
        let column = this.props.columns[columnIndex]
        if (column.key === oldColumn) {
          right = true
          break
        }
        if (typeof newColumns[column.key] !== 'undefined') {
          break
        }
      }
    }
    if (Object.keys(newColumns).length <= 1) {
      right = true
    }

    this.setState(() => {
      const stateChanges = {
        selectedRows: newRows,
        selectedColumns: newColumns,
      }
      if (typeof down !== 'undefined') stateChanges.selectedRowsDown = down
      if (typeof right !== 'undefined') stateChanges.selectedColumnsRight = right
      return stateChanges
    })
  }

  renderHeaders() {
    let columns = []
    this.props.columns.map((column) => {
      let headerProps = {
        ref: `header-${column.key}`,
        key: `header-${column.key}`,
        style: {
          height: `${this.props.rowHeight}px`,
        },
      }
      if (column.width) headerProps.width = column.width
      columns.push(
        <th
          className={ClassNames(column.headerClassName || '')}
          {...headerProps}
        >
          {column.name}
        </th>
      )
    })

    if (this.props.actions && this.props.actions.length) {
      columns.push(
        <th
          ref={el => { this.actions = el }}
          key="actions"
          className="actions"
          width={25}
        />
      )
    }

    return (
      <tr>{columns}</tr>
    )
  }
  renderRows() {
    let numSelectedRows = Object.keys(this.state.selectedRows).length
    let numCopyingRows = Object.keys(this.state.copyingRows).length
    let rows = []

    this.props.objects.map((object) => {
      let ref = `object-${object.id}`

      let selectedColumns = {}
      if (numSelectedRows === 0 || typeof this.state.selectedRows[object.id] !== 'undefined') {
        selectedColumns = this.state.selectedColumns
      }
      let copyingColumns = {}
      if (numCopyingRows === 0 || typeof this.state.copyingRows[object.id] !== 'undefined') {
        copyingColumns = this.state.copyingColumns
      }

      let editing = null
      if (this.state.editing !== null && this.state.editing.objectId === object.id) {
        editing = this.state.editing
      }

      rows.push(
        <this.props.rowComponent
          {...this.props.rowProps}
          ref={ref}
          key={ref}
          object={object}

          cellComponent={this.props.cellComponent}
          cellProps={this.props.cellProps}
          height={this.props.rowHeight}
          columns={this.props.columns}
          editing={editing}
          editReplace={editing === null ? null : this.state.editReplace}
          selectedColumns={selectedColumns}
          copyingColumns={copyingColumns}
          actions={this.props.actions}
          actionsOpen={object.id === this.state.openActions}

          updateField={this.updateField}
          abortField={this.abortField}
          cellError={this.props.onCellError}
          openActions={this.openActions}
          closeActions={this.closeActions}

          onMouseDownCell={this.handleMouseDownCell}
          beginEdit={this.beginEdit}
        />
      )
    })

    if (!rows.length) {
      let numColumns = this.props.columns.length
      if (this.props.actions && this.props.actions.length) numColumns += 1
      return (
        <tr style={{height: this.props.rowHeight}}>
          <td colSpan={numColumns} className="empty">
            {this.props.emptyText}
          </td>
        </tr>
      )
    }
    return rows
  }
  render() {
    let classes = ClassNames('', {
      'editing': (this.state.editing !== null),
    })
    return (
      <div className="object-table-container">
        <table
          ref={el => { this.table = el }}
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
    )
  }
}

export default ObjectTable
export { ObjectCell, ObjectRow, BaseEditor, TextEditor, TextDrawer }
