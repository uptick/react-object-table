import React from 'react'
import ReactDom from 'react-dom'

import ObjectTable from 'react-object-table'

class SimpleTable extends React.Component {
  state = {
    objects: [
      {id: 1, firstName: 'Jon', lastName: 'Athon'},
      {id: 2, firstName: 'Andrew', lastName: 'Angagram'},
      {id: 3, firstName: 'Craig', lastName: 'Jenny'},
      {id: 4, firstName: 'Luke', lastName: 'Hotkins'},
    ],
  }

  handleUpdate(id, values) {
    this.setState(state => {
      state.objects.map((object, index) => {
        if (object.id === id) {
          state.objects[index] = {
            ...object,
            ...values,
          };
        }
      });
      return state;
    });
  }

  render() {
    return (
      <ObjectTable
        columns={this.props.columns}
        objects={this.state.objects}
        onUpdate={this.handleUpdate.bind(this)}
      />
    );
  }
}
SimpleTable.defaultProps = {
  columns: [
    {
      name: 'First Name',
      key: 'firstName',
    },
    {
      name: 'Last Name',
      key: 'lastName',
    },
  ],
};

var mount = document.querySelectorAll('div.demo-mount-simple');
ReactDom.render(
  <SimpleTable />,
  mount[0]
);
