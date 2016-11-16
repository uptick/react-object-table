import React from 'react'
import ReactDOM from 'react-dom'

import Moment from 'moment'

import ObjectTable from 'react-object-table'

class SinceDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span>{Moment(this.props.value).fromNow()}</span>
    );
  }
}
SinceDrawer = {
  className: 'since-drawer',
  component: SinceDrawer,
};

class SimpleTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      objects: [
        {
          id: 1,
          firstName: 'Sean',
          lastName: 'MacMini',
          updated: +(Moment() - Moment.duration({weeks: 1})),
        },
        {
          id: 2,
          firstName: 'Jarek',
          lastName: 'Grwovwatski',
          updated: +(Moment() - Moment.duration({weeks: 1})),
        },
      ],
    };
  }

  handleUpdate(id, values) {
    this.setState(state => {
      state.objects.map((object, index) => {
        if (object.id === id) {
          state.objects[index] = {
            ...object,
            ...values,
            updated: +Moment(),
          };
        }
      });
      return state;
    });
  }
  handleDuplicate(id) {
    this.setState(state => {
      var newId = 0;
      var original;
      state.objects.map((object) => {
        if (object.id === id) {
          original = object;
        }
        if (object.id > newId) {
          newId = object.id;
        }
      });
      newId++;
      if (original) {
        state.objects.push({
          ...original,
          id: newId,
          updated: +Moment(),
        });
      }
      return state;
    });
  }

  render() {
    return (
      <ObjectTable
        columns={this.props.columns}
        objects={this.state.objects}
        onUpdate={this.handleUpdate.bind(this)}
        actions={[
          {label: 'Duplicate', func: this.handleDuplicate.bind(this)},
        ]}
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
    {
      name: 'Updated',
      key: 'updated',
      editor: false,
      drawer: SinceDrawer,
      width: 200,
    },
  ],
};

var mount = document.querySelectorAll('div.demo-mount-features');
ReactDOM.render(
  <SimpleTable />,
  mount[0]
);
