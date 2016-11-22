import React from 'react'
import Clone from 'clone'
import classNames from 'classnames'

import TextDrawer from './drawers/text.jsx'
import TextEditor from './editors/text.jsx'

class ObjectCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
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
      'onMouseDownCell': true,
      'beginEdit': true,
      'updateField': true,
      'abortField': true,
      'cellError': true,
    };
    if (isShallowDifferent(this.props, nextProps, propsExemptions) || isShallowDifferent(nextProps, this.props, propsExemptions)) {
      return true;
    }
    if (isShallowDifferent(this.state, nextState) || isShallowDifferent(nextState, this.state)) {
      return true;
    }
    return false;
  }

  getCellRef() {
    return {
      columnKey: this.props.column.key,
      objectId: this.props.objectId,
    };
  }

  handleMouseDown(event) {
    var button = event.which || event.button;
    event.preventDefault();
    if (button == 0)
      this.props.onMouseDownCell(this.getCellRef(), event.clientX, event.clientY, event.shiftKey);
  }
  handleDoubleClick(event) {
    this.beginEdit();
  }
  beginEdit(editReplaceOverride) {
    if (!this.props.disabled && this.props.column.editor !== false)
      this.props.beginEdit(this.getCellRef(), editReplaceOverride);
  }

  render() {
    var classes = classNames('', {
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
      drawerProps.beginEdit = this.beginEdit.bind(this);
      drawerProps.context = this.props.drawerContext;

      var cellProps = {
        className: classNames(classes + ' drawer ' + drawer.className, {
          uneditable: (this.props.column.editor === false),
        }),
        onMouseDown: this.handleMouseDown.bind(this),
        onDoubleClick: this.handleDoubleClick.bind(this),
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
  }
}
ObjectCell.defaultProps = {
  // column: {}, // from row
  // objectId: 1, // from row
};

export default ObjectCell
