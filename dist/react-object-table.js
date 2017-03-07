(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("jquery"), require("classnames"), require("clone"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "jquery", "classnames", "clone"], factory);
	else if(typeof exports === 'object')
		exports["react-object-table"] = factory(require("react"), require("react-dom"), require("jquery"), require("classnames"), require("clone"));
	else
		root["react-object-table"] = factory(root["react"], root["react-dom"], root["jquery"], root["classnames"], root["clone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TextDrawer = exports.TextEditor = exports.BaseEditor = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _classnames = __webpack_require__(4);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _clone = __webpack_require__(5);

	var _clone2 = _interopRequireDefault(_clone);

	var _utilities = __webpack_require__(6);

	var _clipboard = __webpack_require__(7);

	var _text = __webpack_require__(8);

	var _text2 = _interopRequireDefault(_text);

	var _text3 = __webpack_require__(10);

	var _text4 = _interopRequireDefault(_text3);

	var _objectRow = __webpack_require__(11);

	var _objectRow2 = _interopRequireDefault(_objectRow);

	var _baseEditor = __webpack_require__(9);

	var _baseEditor2 = _interopRequireDefault(_baseEditor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _iOSDevice = false;
	if (typeof navigator !== 'undefined') _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);

	var ObjectTable = function (_React$PureComponent) {
	  _inherits(ObjectTable, _React$PureComponent);

	  function ObjectTable(props) {
	    _classCallCheck(this, ObjectTable);

	    var _this = _possibleConstructorReturn(this, (ObjectTable.__proto__ || Object.getPrototypeOf(ObjectTable)).call(this, props));

	    _this.state = _extends({}, _this.state, {

	      editing: null,
	      editReplace: null,

	      selectionDragStart: null,

	      selectedRows: {},
	      selectedColumns: {},
	      selectedRowsDown: true,
	      selectedColumnsRight: true,

	      copyingRows: {},
	      copyingColumns: {},

	      openActions: null
	    });
	    return _this;
	  }

	  _createClass(ObjectTable, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      (0, _jquery2.default)(document).on('mousemove', this.handleMouseMove.bind(this));
	      (0, _jquery2.default)(document).on('keypress', this.handleKeyPress.bind(this));
	      (0, _jquery2.default)(document).on('keydown', this.handleKeyDown.bind(this));
	      (0, _jquery2.default)(document).on('mouseup', function (event) {
	        var parentContainer = (0, _jquery2.default)(event.target).closest('.object-table-container');
	        if (parentContainer.length == 1) {
	          if (parentContainer[0] == _reactDom2.default.findDOMNode(_this2)) return;
	        }
	        if (_this2.state.selectionDragStart === null) _this2.handleClickOutside(event);
	      });
	      (0, _jquery2.default)(document).on('mouseup', this.handleMouseUp.bind(this));
	      (0, _jquery2.default)(document).on('copy', function (event) {
	        var theEvent = event;
	        if (Object.keys(_this2.state.selectedColumns).length > 0 || Object.keys(_this2.state.selectedRows).length) _this2.handleCopy(theEvent);
	      });
	      (0, _jquery2.default)(document).on('paste', function (event) {
	        var theEvent = event;
	        var clipboardObjects = (0, _clipboard.deserialize_cells)(theEvent.originalEvent.clipboardData);
	        if (clipboardObjects.length) {
	          _this2.handlePaste(clipboardObjects);
	        }
	      });
	    }
	  }, {
	    key: 'columnIsEditable',
	    value: function columnIsEditable(columnKey) {
	      for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
	        var column = this.props.columns[columnIndex];
	        if (column.key == columnKey) {
	          return column.editor !== false;
	        }
	      }
	      return false;
	    }
	  }, {
	    key: 'getEventCellRef',
	    value: function getEventCellRef(event) {
	      var cell = (0, _jquery2.default)(event.target);
	      if (!cell.is('td')) cell = cell.closest('td');
	      var objectId = cell.data('object-id');
	      var columnKey = cell.data('column-key');
	      return {
	        objectId: objectId,
	        columnKey: columnKey
	      };
	    }
	  }, {
	    key: 'getDraggedColumns',
	    value: function getDraggedColumns(startX, endX, tableBounds) {
	      var _this3 = this;

	      var cols = {};

	      var tableLeft = tableBounds.left + document.body.scrollLeft;

	      var lowestX = startX;
	      var highestX = endX;
	      if (lowestX > highestX) {
	        var tempX = lowestX;
	        lowestX = highestX;
	        highestX = tempX;
	      }
	      this.props.columns.map(function (column) {
	        var colElem = _this3.refs['header-' + column.key];
	        var colLeft = tableLeft + colElem.offsetLeft;
	        var colRight = colLeft + colElem.offsetWidth;

	        var inLeft = colRight >= lowestX && colLeft <= highestX;
	        var inRight = colLeft <= highestX && colRight >= lowestX;
	        if (inLeft || inRight) cols[column.key] = true;
	      });

	      return cols;
	    }
	  }, {
	    key: 'getDraggedRows',
	    value: function getDraggedRows(startY, endY, tableBounds) {
	      var rows = {};

	      var tableTop = tableBounds.top + document.body.scrollTop;

	      var lowestY = startY;
	      var highestY = endY;
	      if (lowestY > highestY) {
	        var tempY = lowestY;
	        lowestY = highestY;
	        highestY = tempY;
	      }
	      for (var rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
	        var object = this.props.objects[rowIndex];
	        var rowElem = _reactDom2.default.findDOMNode(this.refs['object-' + object.id]);
	        if (!rowElem) continue;
	        var rowTop = tableTop + rowElem.offsetTop;
	        var rowBottom = rowTop + rowElem.offsetHeight;

	        var inTop = rowBottom >= lowestY && rowTop < highestY;
	        var inBottom = rowTop < highestY && rowBottom >= lowestY;
	        if (inTop || inBottom) rows[object.id] = true;
	      }

	      return rows;
	    }
	  }, {
	    key: 'getSelectedFirstVisibleRow',
	    value: function getSelectedFirstVisibleRow(reverse) {
	      var allRows = (0, _clone2.default)(this.props.objects || []);
	      if (reverse) allRows = allRows.reverse();

	      for (var rowIndex = 0; rowIndex < allRows.length; rowIndex++) {
	        var row = allRows[rowIndex];
	        if (typeof this.state.selectedRows[row.id] != 'undefined') return row.id;
	      }
	      return null;
	    }
	  }, {
	    key: 'getSelectedFirstVisibleColumn',
	    value: function getSelectedFirstVisibleColumn(reverse) {
	      var allColumns = (0, _clone2.default)(this.props.columns);
	      if (reverse) allColumns = allColumns.reverse();

	      for (var columnIndex = 0; columnIndex < allColumns.length; columnIndex++) {
	        var column = allColumns[columnIndex];
	        if (typeof this.state.selectedColumns[column.key] != 'undefined') return column.key;
	      }
	      return null;
	    }
	  }, {
	    key: 'getSelectedNextVisibleRow',
	    value: function getSelectedNextVisibleRow(reverse) {
	      var allRows = (0, _clone2.default)(this.props.objects || []);
	      if (reverse) allRows = allRows.reverse();

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
	  }, {
	    key: 'getSelectedNextVisibleColumn',
	    value: function getSelectedNextVisibleColumn(reverse) {
	      var allColumns = (0, _clone2.default)(this.props.columns);
	      if (reverse) allColumns = allColumns.reverse();

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
	  }, {
	    key: 'handleKeyPress',
	    value: function handleKeyPress(event) {
	      if (this.state.editing === null) {
	        var editRow = this.getSelectedFirstVisibleRow();
	        var editColumn = this.getSelectedFirstVisibleColumn();
	        if (editRow !== null && editColumn !== null) {
	          var editObject;
	          for (var objectIndex = 0; objectIndex < this.props.objects.length; objectIndex++) {
	            var object = this.props.objects[objectIndex];
	            if (object.id == editRow) editObject = object;
	          }
	          var keyPressed = event.key;
	          // switch (keyPressed.toLowerCase()) {
	          switch (event.which) {

	            // case 'enter':
	            case 13:
	              if (this.columnIsEditable(editColumn) && editObject && !editObject.disabled) {
	                this.setState(function (state) {
	                  state.editing = {
	                    columnKey: editColumn,
	                    objectId: editRow
	                  };
	                  state.editReplace = null;
	                  return state;
	                });
	              }
	              event.preventDefault();
	              break;

	            default:
	              if (this.columnIsEditable(editColumn) && editObject && !editObject.disabled) {
	                this.setState(function (state) {
	                  state.editing = {
	                    columnKey: editColumn,
	                    objectId: editRow
	                  };
	                  var keyPressed = String.fromCharCode(event.which);
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
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(event) {
	      var reactClass = this;
	      var directionKeys = {
	        38: 'arrow_up',
	        40: 'arrow_down',
	        37: 'arrow_left',
	        39: 'arrow_right'
	      };
	      var actionKeys = {
	        27: 'escape',
	        9: 'tab',
	        8: 'backspace'
	      };
	      if (this.state.editing === null) {
	        var selectedCells = Object.keys(this.state.selectedRows).length;
	        selectedCells *= Object.keys(this.state.selectedColumns).length;
	        if (selectedCells > 0) {
	          switch (directionKeys[event.which]) {

	            case 'arrow_up':
	              if (event.shiftKey) {
	                var newRows = (0, _clone2.default)(this.state.selectedRows);
	                if (Object.keys(this.state.selectedRows).length > 1 && this.state.selectedRowsDown) delete newRows[this.getSelectedFirstVisibleRow(true)];else newRows[this.getSelectedNextVisibleRow(true)] = true;
	                this.changeSelectionTo(newRows, this.state.selectedColumns);
	              } else {
	                this.moveSelectionTo(this.getSelectedNextVisibleRow(true), this.getSelectedFirstVisibleColumn());
	              }
	              break;

	            case 'arrow_down':
	              if (event.shiftKey) {
	                var newRows = (0, _clone2.default)(this.state.selectedRows);
	                if (Object.keys(this.state.selectedRows).length > 1 && !this.state.selectedRowsDown) delete newRows[this.getSelectedFirstVisibleRow()];else newRows[this.getSelectedNextVisibleRow()] = true;
	                this.changeSelectionTo(newRows, this.state.selectedColumns);
	              } else {
	                this.moveSelectionTo(this.getSelectedNextVisibleRow(), this.getSelectedFirstVisibleColumn());
	              }
	              break;

	            case 'arrow_left':
	              if (event.shiftKey) {
	                var newColumns = (0, _clone2.default)(this.state.selectedColumns);
	                if (Object.keys(this.state.selectedColumns).length > 1 && this.state.selectedColumnsRight) delete newColumns[this.getSelectedFirstVisibleColumn(true)];else newColumns[this.getSelectedNextVisibleColumn(true)] = true;
	                this.changeSelectionTo(this.state.selectedRows, newColumns);
	              } else {
	                this.moveSelectionTo(this.getSelectedFirstVisibleRow(), this.getSelectedNextVisibleColumn(true));
	              }
	              break;

	            case 'arrow_right':
	              if (event.shiftKey) {
	                var newColumns = (0, _clone2.default)(this.state.selectedColumns);
	                if (Object.keys(this.state.selectedColumns).length > 1 && !this.state.selectedColumnsRight) delete newColumns[this.getSelectedFirstVisibleColumn()];else newColumns[this.getSelectedNextVisibleColumn()] = true;
	                this.changeSelectionTo(this.state.selectedRows, newColumns);
	              } else {
	                this.moveSelectionTo(this.getSelectedFirstVisibleRow(), this.getSelectedNextVisibleColumn());
	              }
	              break;

	          }
	          switch (actionKeys[event.which]) {

	            case 'escape':
	              if (Object.keys(this.state.copyingColumns).length > 0 || Object.keys(this.state.copyingRows).length > 0) {
	                this.setState(function (state) {
	                  state.copyingColumns = {};
	                  state.copyingRows = {};
	                  return state;
	                });
	              }
	              break;

	            case 'backspace':
	              var editColumn = reactClass.getSelectedFirstVisibleColumn();
	              if (selectedCells > 0 && reactClass.columnIsEditable(editColumn)) {
	                this.setState(function (state) {
	                  state.editing = {
	                    columnKey: editColumn,
	                    objectId: reactClass.getSelectedFirstVisibleRow()
	                  };
	                  state.editReplace = '';
	                  return state;
	                });
	              }
	              break;

	            case 'tab':
	              if (typeof this.state.selectedColumns[this.getSelectedNextVisibleColumn()] == 'undefined') {
	                this.moveSelectionTo(this.getSelectedFirstVisibleRow(), this.getSelectedNextVisibleColumn());
	              } else {
	                this.moveSelectionTo(this.getSelectedNextVisibleRow(), this.props.columns[0].key);
	              }
	              break;
	          }
	          if (typeof directionKeys[event.which] !== 'undefined' || typeof actionKeys[event.which] !== 'undefined') event.preventDefault();
	        }
	      }
	    }
	  }, {
	    key: 'handleClickOutside',
	    value: function handleClickOutside(event) {
	      if (this.state.editing) {
	        this.refs['object-' + this.state.editing.objectId].refs['column-' + this.state.editing.columnKey].refs.editor.handleBlur();
	      } else if (Object.keys(this.state.selectedRows).length != 0 || Object.keys(this.state.selectedColumns).length != 0) {
	        this.setState(function (state) {
	          state.selectedRows = {};
	          state.selectedColumns = {};
	          return state;
	        });
	      }
	      if (!(0, _jquery2.default)(event.target).closest('ul.actions').length) {
	        this.closeActions();
	      }
	    }
	  }, {
	    key: 'beginEdit',
	    value: function beginEdit(ref, editReplaceOverride) {
	      var editReplace = null;
	      if (typeof editReplaceOverride !== 'undefined') {
	        editReplace = editReplaceOverride;
	      }
	      this.setState(function (state) {
	        state.editing = ref;
	        state.editReplace = editReplaceOverride;
	        return state;
	      });
	    }
	  }, {
	    key: 'handleMouseDownCell',
	    value: function handleMouseDownCell(ref, clientX, clientY, shift) {
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
	            if (selectingDown && row.id == currentRow || !selectingDown && row.id == ref.objectId) selecting = true;
	            if (selecting) newSelectionRows[row.id] = true;
	            if (selectingDown && row.id == ref.objectId || !selectingDown && row.id == currentRow) break;
	          }
	          var newSelectionColumns = {};
	          selecting = false;
	          for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
	            var column = this.props.columns[columnIndex];
	            if (selectingRight && column.key == currentColumn || !selectingRight && column.key == ref.columnKey) selecting = true;
	            if (selecting) newSelectionColumns[column.key] = true;
	            if (selectingRight && column.key == ref.columnKey || !selectingRight && column.key == currentColumn) break;
	          }

	          this.setState(function (state) {
	            state.selectedColumns = newSelectionColumns;
	            state.selectedRows = newSelectionRows;
	            state.selectedRowsDown = selectingDown;
	            state.selectedColumnsRight = selectingRight;
	            return state;
	          });
	        } else {
	          this.setState(function (state) {
	            state.selectionDragStart = {
	              x: mouseX + document.body.scrollLeft,
	              y: mouseY + document.body.scrollTop
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
	  }, {
	    key: 'handleMouseMove',
	    value: function handleMouseMove(event) {
	      var _this4 = this;

	      if (this.state.selectionDragStart !== null) {
	        var mouseX = event.clientX + document.body.scrollLeft;
	        var mouseY = event.clientY + document.body.scrollTop;
	        this.setState(function (state) {
	          var tableBounds = _this4.refs.table.getBoundingClientRect();
	          state.selectedColumns = _this4.getDraggedColumns(state.selectionDragStart.x, mouseX, tableBounds);
	          state.selectedRows = _this4.getDraggedRows(state.selectionDragStart.y, mouseY, tableBounds);
	          state.selectedColumnsRight = true;
	          state.selectedRowsDown = true;
	          return state;
	        });
	      }
	    }
	  }, {
	    key: 'handleMouseUp',
	    value: function handleMouseUp(event) {
	      var _this5 = this;

	      if (this.state.selectionDragStart !== null) {
	        var mouseX = event.clientX + document.body.scrollLeft;
	        var mouseY = event.clientY + document.body.scrollTop;
	        this.setState(function (state) {
	          var tableBounds = _this5.refs.table.getBoundingClientRect();
	          state.selectedColumnsRight = state.selectionDragStart.x < mouseX;
	          state.selectedRowsDown = state.selectionDragStart.y < mouseY;
	          state.selectedColumns = _this5.getDraggedColumns(state.selectionDragStart.x, mouseX, tableBounds);
	          state.selectedRows = _this5.getDraggedRows(state.selectionDragStart.y, mouseY, tableBounds);
	          state.selectionDragStart = null;
	          return state;
	        });
	      }
	    }
	  }, {
	    key: 'handleCopy',
	    value: function handleCopy(event) {
	      var clipboardData = event.originalEvent.clipboardData;
	      if (clipboardData) clipboardData.clearData();
	      var cellsData = [];
	      for (var rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
	        var row = this.props.objects[rowIndex];
	        if (Object.keys(this.state.selectedRows).length > 0 && typeof this.state.selectedRows[row.id] == 'undefined') continue;
	        var cellRow = [];
	        for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
	          var column = this.props.columns[columnIndex];
	          if (Object.keys(this.state.selectedColumns).length > 0 && typeof this.state.selectedColumns[column.key] == 'undefined') continue;
	          cellRow.push(row[column.key]);
	        }
	        cellsData.push(cellRow);
	      }

	      var stringData = '';
	      var longestColumns = [];
	      for (var rowIndex = 0; rowIndex < cellsData.length; rowIndex++) {
	        for (var columnIndex = 0; columnIndex < cellsData[rowIndex].length; columnIndex++) {
	          var stringVal = (0, _clipboard.string_value)(cellsData[rowIndex][columnIndex]);

	          if (typeof longestColumns[columnIndex] == 'undefined' || longestColumns[columnIndex] < stringVal.length) longestColumns[columnIndex] = stringVal.length;
	        }
	      }
	      for (var rowIndex = 0; rowIndex < cellsData.length; rowIndex++) {
	        for (var columnIndex = 0; columnIndex < cellsData[rowIndex].length; columnIndex++) {
	          var stringVal = (0, _clipboard.string_value)(cellsData[rowIndex][columnIndex]);
	          stringData += stringVal;
	          var numSpaces = longestColumns[columnIndex] - stringVal.length;
	          if (columnIndex != cellsData[rowIndex].length - 1) numSpaces += 1;
	          for (var i = 0; i < numSpaces; i++) {
	            stringData += ' ';
	          }
	        }
	        stringData += '\n';
	      }

	      var csvData = '';
	      for (var rowIndex = 0; rowIndex < cellsData.length; rowIndex++) {
	        for (var columnIndex = 0; columnIndex < cellsData[rowIndex].length; columnIndex++) {
	          var stringVal = (0, _clipboard.string_value)(cellsData[rowIndex][columnIndex]);
	          // var wrapQuotes = (stringVal.indexOf(',') != -1);
	          var wrapQuotes = false;
	          if (wrapQuotes) csvData += '"';
	          // csvData += stringVal.replace('"', '""');
	          csvData += stringVal.replace('\t', ' ');
	          if (wrapQuotes) csvData += '"';
	          if (columnIndex != cellsData[rowIndex].length - 1) csvData += '\t';
	        }
	        csvData += '\n';
	      }

	      clipboardData.setData('text/plain', csvData);
	      clipboardData.setData('react/object-grid', JSON.stringify(cellsData));
	      // clipboardData.setData('application/csv', csvData);
	      event.preventDefault();
	      this.setState(function (state) {
	        state.copyingRows = state.selectedRows;
	        state.copyingColumns = state.selectedColumns;
	        return state;
	      });
	    }
	  }, {
	    key: 'handlePaste',
	    value: function handlePaste(pasteData) {
	      var reactClass = this;
	      var raise_row_errors = function raise_row_errors(errors, row) {
	        var numErrors = Object.keys(errors).length;
	        if (numErrors) {
	          var message;
	          if (numErrors > 1) message = 'Invalid values given for ';else message = 'Invalid value given for ';
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
	          if (!pastingRow && typeof reactClass.state.selectedRows[row.id] == 'undefined') continue;
	          pastingRow = true;
	          if (pastingRowIndex < pasteData.length) {
	            newSelectionRows[row.id] = true;
	            var pastingColumn = false;
	            var pastingColumnIndex = 0;
	            var updates = {};
	            var errors = {};
	            for (var columnIndex = 0; columnIndex < reactClass.props.columns.length; columnIndex++) {
	              var column = reactClass.props.columns[columnIndex];
	              if (!pastingColumn && typeof reactClass.state.selectedColumns[column.key] == 'undefined') continue;
	              pastingColumn = true;
	              if (pastingColumnIndex < pasteData[pastingRowIndex].length) {
	                newSelectionColumns[column.key] = true;
	                if (column.editor !== false && !row.disabled) {
	                  var editor = column.editor || _text2.default;
	                  var validated = editor.validate(pasteData[pastingRowIndex][pastingColumnIndex], column.editorProps || {});
	                  if (validated.valid) updates[column.key] = validated.cleanedValue;else errors[column.key] = true;
	                }
	                pastingColumnIndex++;
	              }
	            }
	            if (Object.keys(updates).length) objectUpdates.push([row.id, updates]);
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
	          if (typeof reactClass.state.selectedRows[row.id] == 'undefined') continue;
	          var updates = {};
	          var errors = {};
	          for (var columnIndex = 0; columnIndex < reactClass.props.columns.length; columnIndex++) {
	            var column = reactClass.props.columns[columnIndex];
	            if (typeof reactClass.state.selectedColumns[column.key] == 'undefined') continue;
	            if (column.editor !== false && !row.disabled) {
	              var editor = column.editor || _text2.default;
	              var validated = editor.validate(pasteData[pasteRow][pasteColumn], column.editorProps || {});
	              if (validated.valid) updates[column.key] = validated.cleanedValue;else errors[column.key] = true;
	            }
	            pasteColumn++;
	            if (pasteColumn >= pasteData[pasteRow].length) pasteColumn = 0;
	          }
	          pasteColumn = 0;
	          if (Object.keys(updates).length) objectUpdates.push([row.id, updates]);
	          raise_row_errors(errors, row);
	          pasteRow++;
	          if (pasteRow >= pasteData.length) pasteRow = 0;
	        }

	        reactClass.updateManyObjects(objectUpdates);
	      }
	      reactClass.setState(function (state) {
	        state.copyingColumns = {};
	        state.copyingRows = {};
	        return state;
	      });
	    }
	  }, {
	    key: 'abortField',
	    value: function abortField(action) {
	      this.setState(function (state) {
	        state.editing = null;
	        return state;
	      });
	    }
	  }, {
	    key: 'updateField',
	    value: function updateField(objectId, columnKey, newValue, action) {
	      var _this6 = this;

	      var reactClass = this;

	      var updates = {};
	      updates[columnKey] = newValue;
	      this.updateObject(objectId, updates);

	      var updateAction = action;
	      reactClass.setState(function (state) {
	        state.editing = null;
	        if ((0, _utilities.dict_count)(state.selectedRows) == 1 && (0, _utilities.dict_count)(state.selectedColumns) == 1) {
	          switch (updateAction) {

	            case 'nextRow':
	              state.selectedRows = {};
	              state.selectedRows[_this6.getSelectedNextVisibleRow()] = true;
	              break;

	            case 'nextColumn':
	              state.selectedColumns = {};
	              state.selectedColumns[_this6.getSelectedNextVisibleColumn()] = true;
	              break;
	          }
	        }
	        return state;
	      });
	    }
	  }, {
	    key: 'updateManyObjects',
	    value: function updateManyObjects(updates) {
	      if (typeof this.props.onUpdateMany == 'function') this.props.onUpdateMany(updates);else {
	        for (var updateId = 0; updateId < updates.length; updateId++) {
	          var update = updates[updateId];
	          this.updateObject(update[0], update[1]);
	        }
	      }
	    }
	  }, {
	    key: 'updateObject',
	    value: function updateObject(objectId, updates) {
	      if (typeof this.props.onUpdate == 'function') {
	        this.props.onUpdate(objectId, updates);
	      } else {
	        console.log('If I had a props.onUpdate, I would update object', objectId, 'with', updates);
	      }
	    }
	  }, {
	    key: 'openActions',
	    value: function openActions(id) {
	      this.setState(function (state) {
	        state.openActions = id;
	        return state;
	      });
	    }
	  }, {
	    key: 'closeActions',
	    value: function closeActions() {
	      if (this.state.openActions === null) return;
	      this.setState(function (state) {
	        state.openActions = null;
	        return state;
	      });
	    }
	  }, {
	    key: 'moveSelectionTo',
	    value: function moveSelectionTo(row, column) {
	      var newRows = {};
	      var newColumns = {};
	      newRows[row] = true;
	      newColumns[column] = true;
	      this.changeSelectionTo(newRows, newColumns);
	    }
	  }, {
	    key: 'changeSelectionTo',
	    value: function changeSelectionTo(rows, columns) {
	      var newRows = rows;
	      var newColumns = columns;

	      var down;
	      if (Object.keys(this.state.selectedRows).length == 1 && Object.keys(newRows).length > 1) {
	        down = false;
	        var oldRow = (0, _utilities.dict_first_key)(this.state.selectedRows);
	        for (var rowIndex = 0; rowIndex < this.props.objects.length; rowIndex++) {
	          var row = this.props.objects[rowIndex];
	          if (row.id == oldRow) {
	            down = true;
	            break;
	          }
	          if (typeof newRows[row.id] !== 'undefined') break;
	        }
	      }
	      if (Object.keys(newRows).length <= 1) down = true;

	      var right;
	      if (Object.keys(this.state.selectedColumns).length == 1 && Object.keys(newColumns).length > 1) {
	        right = false;
	        var oldColumn = (0, _utilities.dict_first_key)(this.state.selectedColumns);
	        for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
	          var column = this.props.columns[columnIndex];
	          if (column.key == oldColumn) {
	            right = true;
	            break;
	          }
	          if (typeof newColumns[column.key] !== 'undefined') break;
	        }
	      }
	      if (Object.keys(newColumns).length <= 1) right = true;

	      this.setState(function (state) {
	        if (typeof down !== 'undefined') state.selectedRowsDown = down;
	        if (typeof right !== 'undefined') state.selectedColumnsRight = right;
	        state.selectedRows = newRows;
	        state.selectedColumns = newColumns;
	        return state;
	      });
	    }
	  }, {
	    key: 'renderHeaders',
	    value: function renderHeaders() {
	      var _this7 = this;

	      var columns = [];
	      this.props.columns.map(function (column) {
	        var headerProps = {
	          ref: 'header-' + column.key,
	          key: 'header-' + column.key,
	          style: {
	            height: _this7.props.rowHeight + 'px'
	          }
	        };
	        if (column.width) headerProps.width = column.width;
	        columns.push(_react2.default.createElement(
	          'th',
	          _extends({
	            className: (0, _classnames2.default)(column.headerClassName || '')
	          }, headerProps),
	          column.name
	        ));
	      });

	      if (this.props.actions && this.props.actions.length) {
	        columns.push(_react2.default.createElement('th', {
	          ref: 'actions',
	          key: 'actions',
	          className: 'actions',
	          width: 25
	        }));
	      }

	      return _react2.default.createElement(
	        'tr',
	        null,
	        columns
	      );
	    }
	  }, {
	    key: 'renderRows',
	    value: function renderRows() {
	      var _this8 = this;

	      var numSelectedRows = Object.keys(this.state.selectedRows).length;
	      var numCopyingRows = Object.keys(this.state.copyingRows).length;
	      var rows = [];
	      this.props.objects.map(function (object) {
	        var ref = 'object-' + object.id;

	        var selectedColumns = {};
	        if (numSelectedRows == 0 || typeof _this8.state.selectedRows[object.id] !== 'undefined') selectedColumns = _this8.state.selectedColumns;
	        var copyingColumns = {};
	        if (numCopyingRows == 0 || typeof _this8.state.copyingRows[object.id] !== 'undefined') copyingColumns = _this8.state.copyingColumns;

	        var editing = null;
	        if (_this8.state.editing !== null && _this8.state.editing.objectId === object.id) {
	          editing = _this8.state.editing;
	        }

	        rows.push(_react2.default.createElement(_objectRow2.default, {
	          ref: ref,
	          key: ref,
	          object: object,

	          height: _this8.props.rowHeight,
	          columns: _this8.props.columns,
	          editing: editing,
	          editReplace: editing === null ? null : _this8.state.editReplace,
	          selectedColumns: selectedColumns,
	          copyingColumns: copyingColumns,
	          actions: _this8.props.actions,
	          actionsOpen: object.id === _this8.state.openActions,

	          updateField: _this8.updateField.bind(_this8),
	          abortField: _this8.abortField.bind(_this8),
	          cellError: _this8.props.onCellError,
	          openActions: _this8.openActions.bind(_this8),
	          closeActions: _this8.closeActions.bind(_this8),

	          onMouseDownCell: _this8.handleMouseDownCell.bind(_this8),
	          beginEdit: _this8.beginEdit.bind(_this8)
	        }));
	      });

	      if (!rows.length) {
	        var numColumns = this.props.columns.length;
	        if (this.props.actions && this.props.actions.length) numColumns += 1;
	        return _react2.default.createElement(
	          'tr',
	          { style: { height: this.props.rowHeight } },
	          _react2.default.createElement(
	            'td',
	            { colSpan: numColumns, className: 'empty' },
	            this.props.emptyText
	          )
	        );
	      }
	      return rows;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'object-table-container' },
	        _react2.default.createElement(
	          'table',
	          {
	            ref: 'table',
	            tabIndex: '1'
	          },
	          _react2.default.createElement(
	            'thead',
	            null,
	            this.renderHeaders()
	          ),
	          _react2.default.createElement(
	            'tbody',
	            null,
	            this.renderRows()
	          )
	        ),
	        _react2.default.createElement('div', {
	          className: (0, _classnames2.default)({ 'editing-overlay': this.state.editing }),
	          onClick: this.handleClickOutside.bind(this)
	        })
	      );
	    }
	  }]);

	  return ObjectTable;
	}(_react2.default.PureComponent);

	ObjectTable.defaultProps = {
	  rowHeight: 32,
	  objects: [{
	    id: 1, // every object is expected to have a unique identifier
	    name: 'Product item report',
	    quantity: '1.0000'
	  }],
	  columns: [{
	    name: 'Description',
	    key: 'description',
	    width: 'auto',
	    drawer: null,
	    drawerProps: null,
	    editor: null,
	    editorProps: null
	  }],
	  emptyText: 'No objects',
	  onRowError: function onRowError(row, message) {
	    console.warn('Unable to update row:', row);
	    console.warn('As the following error was encountered:', message);
	  },
	  onCellError: function onCellError(objectId, columnKey, message) {
	    console.warn('Unable to update row ' + objectId + ' ' + columnKey);
	    console.warn('As the following error was encountered:', message);
	  }
	};

	exports.default = ObjectTable;
	exports.BaseEditor = _baseEditor2.default;
	exports.TextEditor = _text2.default;
	exports.TextDrawer = _text4.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react-dom");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("jquery");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("classnames");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("clone");

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function dict_count(dict) {
	  var count = 0;
	  for (var dictKey in dict) {
	    count++;
	  }return count;
	}

	function dict_first_key(dict) {
	  for (var dictKey in dict) {
	    return dictKey;
	  }return undefined;
	}

	exports.dict_count = dict_count;
	exports.dict_first_key = dict_first_key;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function deserialize_cells(clipboardData) {
	  var gridData = clipboardData.getData('react/object-grid');
	  if (gridData) {
	    return JSON.parse(gridData);
	  }
	  var tabbedData = clipboardData.getData('text/plain');
	  if (tabbedData) {
	    var rows = [];
	    var lines = tabbedData.split('\n');
	    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
	      var columns = [];
	      var tabs = lines[lineIndex].split('\t');
	      for (var tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
	        columns.push(tabs[tabIndex]);
	      }
	      rows.push(columns);
	    }
	    return rows;
	  }
	  return [];
	}

	function string_value(value) {
	  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
	    case 'number':
	      return value.toString();

	    case 'object':
	      if (Array.isArray(value)) {
	        var stringValue = '';
	        for (var valueIndex = 0; valueIndex < value.length; valueIndex++) {
	          stringValue += string_value(value[valueIndex]);
	          if (valueIndex < value.length - 1) stringValue += ', ';
	        }
	        return stringValue;
	      }

	      if (value === null) return '';else return 'object';

	    case 'boolean':
	      if (value) return 'true';else return 'false';

	    case 'string':
	      return value;
	  }
	  return '';
	}

	exports.deserialize_cells = deserialize_cells;
	exports.string_value = string_value;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _baseEditor = __webpack_require__(9);

	var _baseEditor2 = _interopRequireDefault(_baseEditor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _validate(value, props) {
	  return {
	    valid: true,
	    cleanedValue: value
	  };
	}

	var TextEditor = function (_BaseEditor) {
	  _inherits(TextEditor, _BaseEditor);

	  function TextEditor(props) {
	    _classCallCheck(this, TextEditor);

	    return _possibleConstructorReturn(this, (TextEditor.__proto__ || Object.getPrototypeOf(TextEditor)).call(this, props));
	  }

	  _createClass(TextEditor, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      if (this.props.editReplace) {
	        this.refs.field.setSelectionRange(this.state.value.length, this.state.value.length);
	      }
	    }
	  }, {
	    key: 'validate',
	    value: function validate(value) {
	      return _validate(value, this.props);
	    }
	  }, {
	    key: 'handleChange',
	    value: function handleChange(event) {
	      var newValue = this.refs.field.value;
	      this.setState(function (state) {
	        state.value = newValue;
	        return state;
	      });
	    }
	  }, {
	    key: 'handleFocus',
	    value: function handleFocus(event) {
	      var reactClass = this;
	      if (this.props.editReplace === null) {
	        window.setTimeout(function () {
	          var inputElement = reactClass.refs.field;
	          inputElement.select();
	        }, 0);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'form',
	        {
	          onSubmit: this.handleSubmit.bind(this),
	          onKeyDown: this.handleKeyDown.bind(this)
	        },
	        _react2.default.createElement('input', {
	          ref: 'field',
	          value: this.state.value,
	          onChange: this.handleChange.bind(this),
	          onBlur: this.handleBlur.bind(this),
	          onFocus: this.handleFocus.bind(this),
	          autoFocus: true,
	          style: {
	            height: '' + (this.props.height - 2) + 'px',
	            lineHeight: '' + (this.props.height - 2) + 'px'
	          }
	        })
	      );
	    }
	  }]);

	  return TextEditor;
	}(_baseEditor2.default);

	exports.default = {
	  className: 'text-editor',
	  component: TextEditor,
	  validate: _validate
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _validate(value, props) {
	  return {
	    valid: true,
	    cleanedValue: value
	  };
	}

	var BaseEditor = function (_React$Component) {
	  _inherits(BaseEditor, _React$Component);

	  function BaseEditor(props) {
	    _classCallCheck(this, BaseEditor);

	    var _this = _possibleConstructorReturn(this, (BaseEditor.__proto__ || Object.getPrototypeOf(BaseEditor)).call(this, props));

	    _this.state = {
	      value: _this.props.value
	    };
	    if (_this.props.editReplace !== null) {
	      _this.state.value = _this.props.editReplace;
	    }
	    return _this;
	  }

	  _createClass(BaseEditor, [{
	    key: 'validate',
	    value: function validate(value) {
	      return _validate(value, this.props);
	    }
	  }, {
	    key: 'abort',
	    value: function abort(nextAction) {
	      this.props.abort(nextAction);
	    }
	  }, {
	    key: 'commit',
	    value: function commit(value, nextAction) {
	      var validation = this.validate(value);

	      if (validation.valid) {
	        this.props.update(this.props.objectId, this.props.columnKey, validation.cleanedValue, nextAction);
	      } else {
	        this.props.cellError(this.props.objectId, this.props.columnKey, '"' + value + '" is not a valid value.');
	        this.abort(nextAction);
	      }
	    }
	  }, {
	    key: 'handleBlur',
	    value: function handleBlur(event) {
	      this.commit(this.state.value, false);
	    }
	  }, {
	    key: 'handleSubmit',
	    value: function handleSubmit(event) {
	      event.preventDefault();
	      this.commit(this.state.value, 'nextRow');
	    }
	  }, {
	    key: 'handleKeyDown',
	    value: function handleKeyDown(event) {
	      if (event.which == 9) {
	        event.preventDefault();
	        this.commit(this.state.value, 'nextColumn');
	      }
	      if (event.which == 27) {
	        event.preventDefault();
	        this.abort(false);
	      }
	    }
	  }]);

	  return BaseEditor;
	}(_react2.default.Component);

	BaseEditor.defaultProps = {
	  editReplace: null
	};

	exports.default = BaseEditor;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TextDrawer = function (_React$Component) {
	  _inherits(TextDrawer, _React$Component);

	  function TextDrawer(props) {
	    _classCallCheck(this, TextDrawer);

	    return _possibleConstructorReturn(this, (TextDrawer.__proto__ || Object.getPrototypeOf(TextDrawer)).call(this, props));
	  }

	  _createClass(TextDrawer, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'span',
	        null,
	        this.props.value
	      );
	    }
	  }]);

	  return TextDrawer;
	}(_react2.default.Component);

	TextDrawer.defaultProps = {};

	exports.default = {
	  className: 'text-drawer',
	  component: TextDrawer
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _jquery = __webpack_require__(3);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _classnames = __webpack_require__(4);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _utilities = __webpack_require__(6);

	var _objectCell = __webpack_require__(12);

	var _objectCell2 = _interopRequireDefault(_objectCell);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ObjectRow = function (_React$Component) {
	  _inherits(ObjectRow, _React$Component);

	  function ObjectRow(props) {
	    _classCallCheck(this, ObjectRow);

	    var _this = _possibleConstructorReturn(this, (ObjectRow.__proto__ || Object.getPrototypeOf(ObjectRow)).call(this, props));

	    _this.state = _extends({}, _this.state);
	    return _this;
	  }

	  _createClass(ObjectRow, [{
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      var isMissingColumns = function isMissingColumns(propsA, propsB, columnsKey) {
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

	      var isShallowDifferent = function isShallowDifferent(objectA, objectB, exemptions) {
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
	        'beginEdit': true
	      };
	      if (isShallowDifferent(this.props, nextProps, propsExemptions) || isShallowDifferent(nextProps, this.props, propsExemptions)) {
	        return true;
	      }
	      if (isShallowDifferent(this.state, nextState) || isShallowDifferent(nextState, this.state)) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'colInRanges',
	    value: function colInRanges(column, columns, rows) {
	      var numRangeColumns = (0, _utilities.dict_count)(columns);
	      var numRangeRows = (0, _utilities.dict_count)(rows);
	      if (numRangeColumns == 0 && numRangeRows === 0) {
	        return false;
	      } else if (columns !== null && rows === null) {
	        return typeof columns[column.key] != 'undefined';
	      } else if (columns === null && rows !== null) {
	        return true;
	      }
	      return typeof columns[column.key] != 'undefined' && typeof rows[this.props.object.id] != 'undefined';
	    }
	  }, {
	    key: 'openActions',
	    value: function openActions(event) {
	      this.props.openActions(this.props.object.id);
	    }
	  }, {
	    key: 'closeActions',
	    value: function closeActions(event) {
	      this.props.closeActions();
	    }
	  }, {
	    key: 'onActionClick',
	    value: function onActionClick(event) {
	      var reactClass = this;
	      var actionId = (0, _jquery2.default)(event.target).data('action');
	      var action = this.props.actions[actionId];
	      if (action) {
	        reactClass.props.actions[actionId].func(reactClass.props.object.id);
	        if (!action.stayOpen) reactClass.props.closeActions();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var cells = [];
	      for (var columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
	        var column = this.props.columns[columnIndex];
	        var editing = false;
	        if (this.props.editing !== null) {
	          editing = this.props.editing.objectId == this.props.object.id && this.props.editing.columnKey == column.key;
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
	          selected: typeof this.props.selectedColumns[column.key] != 'undefined',
	          copying: typeof this.props.copyingColumns[column.key] != 'undefined',

	          onMouseDownCell: this.props.onMouseDownCell,
	          beginEdit: this.props.beginEdit,

	          updateField: this.props.updateField,
	          abortField: this.props.abortField,
	          cellError: this.props.cellError
	        };
	        cellProps.editorContext = null;
	        if (editing && column.editorContext) cellProps.editorContext = column.editorContext(this.props.object);
	        if (!editing && column.drawerContext) cellProps.drawerContext = column.drawerContext(this.props.object);

	        cellProps.disabled = this.props.object.disabled === true;
	        if (this.props.object.disabled) cellProps.editing = false;else cellProps.editing = editing;

	        cells.push(_react2.default.createElement(_objectCell2.default, cellProps));
	      }
	      if (this.props.actions && this.props.actions.length) {
	        var cellStyle = {
	          lineHeight: this.props.height + 'px'
	        };
	        if (this.props.actionsOpen && !this.props.object.disabled) {
	          var actions = [];
	          for (var actionId = 0; actionId < this.props.actions.length; actionId++) {
	            var action = this.props.actions[actionId];
	            actions.push(_react2.default.createElement(
	              'li',
	              {
	                key: 'action-' + actionId,
	                className: 'action',
	                onClick: this.onActionClick.bind(this),
	                'data-action': actionId
	              },
	              action.label
	            ));
	          }
	          cells.push(_react2.default.createElement(
	            'td',
	            {
	              key: 'actions',
	              ref: 'actions',
	              className: 'actions open',
	              style: cellStyle
	            },
	            _react2.default.createElement(
	              'span',
	              { onClick: this.closeActions.bind(this) },
	              '\u2630'
	            ),
	            _react2.default.createElement(
	              'ul',
	              { className: 'actions' },
	              actions
	            )
	          ));
	        } else {
	          cells.push(_react2.default.createElement(
	            'td',
	            {
	              key: 'actions',
	              ref: 'actions',
	              className: 'actions closed',
	              onClick: this.openActions.bind(this),
	              style: cellStyle
	            },
	            _react2.default.createElement(
	              'span',
	              null,
	              '\u2630'
	            )
	          ));
	        }
	      }
	      return _react2.default.createElement(
	        'tr',
	        {
	          className: (0, _classnames2.default)('', { disabled: this.props.object.disabled == true }),
	          style: {
	            height: '' + this.props.height + 'px'
	          }
	        },
	        cells
	      );
	    }
	  }]);

	  return ObjectRow;
	}(_react2.default.Component);

	ObjectRow.defaultProps = {
	  // columns: [], // from grid
	  // rowHeight: 32, // from grid
	};

	exports.default = ObjectRow;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _clone = __webpack_require__(5);

	var _clone2 = _interopRequireDefault(_clone);

	var _classnames = __webpack_require__(4);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _text = __webpack_require__(10);

	var _text2 = _interopRequireDefault(_text);

	var _text3 = __webpack_require__(8);

	var _text4 = _interopRequireDefault(_text3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ObjectCell = function (_React$Component) {
	  _inherits(ObjectCell, _React$Component);

	  function ObjectCell(props) {
	    _classCallCheck(this, ObjectCell);

	    var _this = _possibleConstructorReturn(this, (ObjectCell.__proto__ || Object.getPrototypeOf(ObjectCell)).call(this, props));

	    _this.state = _extends({}, _this.state);
	    return _this;
	  }

	  _createClass(ObjectCell, [{
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      var isShallowDifferent = function isShallowDifferent(objectA, objectB, exemptions) {
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
	        'onMouseDownCell': true,
	        'beginEdit': true,
	        'updateField': true,
	        'abortField': true,
	        'cellError': true
	      };
	      if (isShallowDifferent(this.props, nextProps, propsExemptions) || isShallowDifferent(nextProps, this.props, propsExemptions)) {
	        return true;
	      }
	      if (isShallowDifferent(this.state, nextState) || isShallowDifferent(nextState, this.state)) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'getCellRef',
	    value: function getCellRef() {
	      return {
	        columnKey: this.props.column.key,
	        objectId: this.props.objectId
	      };
	    }
	  }, {
	    key: 'handleMouseDown',
	    value: function handleMouseDown(event) {
	      var button = event.which || event.button;
	      event.preventDefault();
	      if (button == 0) this.props.onMouseDownCell(this.getCellRef(), event.clientX, event.clientY, event.shiftKey);
	    }
	  }, {
	    key: 'handleDoubleClick',
	    value: function handleDoubleClick(event) {
	      this.beginEdit();
	    }
	  }, {
	    key: 'beginEdit',
	    value: function beginEdit(editReplaceOverride) {
	      if (!this.props.disabled && this.props.column.editor !== false) this.props.beginEdit(this.getCellRef(), editReplaceOverride);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var classes = (0, _classnames2.default)('', {
	        'selected': this.props.selected,
	        'copying': this.props.copying,
	        'editing': this.props.editing
	      });

	      if (this.props.editing) {
	        var editor = this.props.column.editor || _text4.default;
	        var editorProps = (0, _clone2.default)(this.props.column.editorProps || {});
	        editorProps.ref = 'editor';
	        editorProps.value = this.props.value;
	        editorProps.update = this.props.updateField;
	        editorProps.abort = this.props.abortField;
	        editorProps.objectId = this.props.objectId;
	        editorProps.columnKey = this.props.column.key;
	        editorProps.height = this.props.height;
	        editorProps.editReplace = this.props.editReplace;
	        editorProps.cellError = this.props.cellError;
	        editorProps.context = this.props.editorContext;

	        return _react2.default.createElement(
	          'td',
	          {
	            className: classes + ' editor ' + editor.className
	          },
	          _react2.default.createElement(
	            'div',
	            { className: 'contents' },
	            _react2.default.createElement(editor.component, editorProps, null)
	          )
	        );
	      } else {
	        var drawer = this.props.column.drawer || _text2.default;
	        var drawerProps = (0, _clone2.default)(this.props.column.drawerProps || {});
	        drawerProps.ref = 'drawer';
	        drawerProps.value = this.props.value;
	        drawerProps.beginEdit = this.beginEdit.bind(this);
	        drawerProps.context = this.props.drawerContext;

	        var cellProps = {
	          className: (0, _classnames2.default)(classes + ' drawer ' + drawer.className, {
	            uneditable: this.props.column.editor === false
	          }),
	          onMouseDown: this.handleMouseDown.bind(this),
	          onDoubleClick: this.handleDoubleClick.bind(this)
	        };

	        return _react2.default.createElement(
	          'td',
	          cellProps,
	          _react2.default.createElement(
	            'div',
	            { className: 'contents' },
	            _react2.default.createElement(drawer.component, drawerProps, null)
	          )
	        );
	      }
	    }
	  }]);

	  return ObjectCell;
	}(_react2.default.Component);

	ObjectCell.defaultProps = {
	  // column: {}, // from row
	  // objectId: 1, // from row
	};

	exports.default = ObjectCell;

/***/ }
/******/ ])
});
;