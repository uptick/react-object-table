const React = require('react');
const ClassNames = require('classnames');

const TextDrawer = require('./drawers/text.jsx');
const TextEditor = require('./editors/text.jsx');

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
    if (button == 0)
      this.props.onMouseDownCell(this.getCellRef(), event.clientX, event.clientY, event.shiftKey);
  },
  handleDoubleClick: function(event) {
    if (this.props.column.editor !== false)
      this.props.onDoubleClickCell(this.getCellRef());
  },

  render: function() {
    var classes = ClassNames('', {
      'selected': this.props.selected,
      'copying': this.props.copying,
      'editing': this.props.editing,
    });
    var style = {};
    if (this.props.column.width)
      style.width = '' + this.props.column.width + 'px';
    // console.log('this is a cell re rendering');

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

      return (
        <td
          className={classes + ' editor ' + editor.className}
          style={style}
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

      return (
        <td
          className={classes + ' drawer ' + drawer.className}
          style={style}

          onMouseDown={this.handleMouseDown}
          onDoubleClick={this.handleDoubleClick}
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
