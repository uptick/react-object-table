const React = require('react');
const Clone = require('clone');
const ClassNames = require('classnames');

const TextDrawer = require('./drawers/text');
const TextEditor = require('./editors/text');

var ObjectCell = React.createClass({
  getDefaultProps: function() {
    return {
      // column: {}, // from row
      // objectId: 1, // from ro w
    };
  },
  getInitialState: function() {
    return {};
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    for (var propKey in nextProps) {
      if (this.props[propKey] !== nextProps[propKey])
        return true;
    }
    for (var stateKey in nextState) {
      if (this.state[stateKey] !== nextState[stateKey])
        return true;
    }
    return false;
  },

  getCellRef: function() {
    return {
      columnKey: this.props.column.key,
      objectId: this.props.objectId,
    };
  },

  handleMouseDown: function(event) {
    var button = event.which || event.button;
    event.preventDefault();
    if (button == 0)
      this.props.onMouseDownCell(this.getCellRef(), event.clientX, event.clientY, event.shiftKey);
  },
  handleDoubleClick: function(event) {
    this.beginEdit();
  },
  beginEdit: function(editReplaceOverride) {
    if (!this.props.disabled && this.props.column.editor !== false)
      this.props.beginEdit(this.getCellRef(), editReplaceOverride);
  },

  render: function() {
    var classes = ClassNames('', {
      'selected': this.props.selected,
      'copying': this.props.copying,
      'editing': this.props.editing,
    });

    if (this.props.editing) {
      var editor = this.props.column.editor || TextEditor;
      var editorProps = Clone(this.props.column.editorProps || {});
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
      );
    }
    else {
      var drawer = this.props.column.drawer || TextDrawer;
      var drawerProps = Clone(this.props.column.drawerProps || {});
      drawerProps.ref = 'drawer';
      drawerProps.value = this.props.value;
      drawerProps.beginEdit = this.beginEdit;

      var cellProps = {
        className: ClassNames(classes + ' drawer ' + drawer.className, {
          uneditable: (this.props.column.editor === false),
        }),
        onMouseDown: this.handleMouseDown,
        onDoubleClick: this.handleDoubleClick,
      };

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
      );
    }
  },
});

module.exports = ObjectCell;
