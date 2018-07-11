import React from 'react'
import ReactDom from 'react-dom'

import ObjectTable from 'react-object-table'
import { TextEditor } from 'react-object-table'

class ColourDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{
        textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block',
          borderRadius: '50%',
          width: '1.4rem',
          height: '1.4rem',
          backgroundColor: this.props.value,
          boxShadow: 'inset 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.25)',
        }}></span>
      </div>
    );
  }
}
ColourDrawer = {
  className: 'since-drawer',
  component: ColourDrawer,
};

function validate_age(value, props) {
  var intAge = parseInt(value);
  if (isNaN(intAge)) {
    return {valid: false,};
  }
  if (intAge < 0 || intAge > 125) {
    return {valid: false,};
  }
  return {
    valid: true,
    cleanedValue: intAge,
  };
}
class AgeEditor extends TextEditor.component {
  validate(value) {
    return validate_age(value, this.props);
  }
}
AgeEditor = {
  className: 'age-editor',
  component: AgeEditor,
  validate: validate_age,
};

class CustomisedTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      exception: null,
      objects: [
        {
          id: 1,
          name: 'Phillip',
          favouriteColour: 'black',
          age: 75,
        },
        {
          id: 2,
          name: 'Michael',
          favouriteColour: '#f44',
          age: 19,
        },
        {
          id: 3,
          name: 'Steven McShane',
          favouriteColour: '#05AB45',
          age: 22,
        },
        {
          id: 4,
          name: 'Aidan',
          favouriteColour: 'rebeccapurple',
          age: 31,
        },
      ],
    };
  }

  handleUpdate(id, values) {
    this.setState(prevState => {
      const stateChanges = {
        exception: null,
        objects: prevState.objects,
      }
      prevState.objects.map((object, index) => {
        if (object.id === id) {
          stateChanges.objects[index] = {
            ...object,
            ...values,
          };
        }
      });
      return stateChanges;
    });
  }
  handleCellError(objectId, columnKey, message) {
    this.setState({exception: `Unable to update ${columnKey}:\n${message}`});
  }
  handleRowError(row, message) {
    this.setState({exception: message});
  }

  render() {
    var exception;
    if (this.state.exception !== null) {
      exception = (
        <div style={{
          display: 'block',
          padding: '1rem',
          borderRadius: '0.2rem',
          background: '#ff4c4c',
          fontSize: '1rem',
          color: '#fff',
          margin: '0 auto',
          maxWidth: '20rem',
          whiteSpace: 'pre',
        }}>
          {this.state.exception}
        </div>
      );
    }
    return (
      <div>
        <ObjectTable
          columns={this.props.columns}
          objects={this.state.objects}
          onUpdate={this.handleUpdate.bind(this)}
          onCellError={this.handleCellError.bind(this)}
          onRowError={this.handleRowError.bind(this)}
        />
        {exception}
      </div>
    );
  }
}
CustomisedTable.defaultProps = {
  columns: [
    {
      name: 'Name',
      key: 'name',
    },
    {
      name: 'Age',
      key: 'age',
      width: 100,
      editor: AgeEditor,
    },
    {
      name: 'Favourite HTML Colour',
      key: 'favouriteColour',
      width: 170,
      drawer: ColourDrawer,
    },
  ],
};

var mount = document.querySelectorAll('div.demo-mount-customisation');
ReactDom.render(
  <CustomisedTable />,
  mount[0]
);
