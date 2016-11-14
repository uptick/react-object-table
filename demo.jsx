import React from 'react'
import ReactDOM from 'react-dom'

import ObjectTable from 'react-object-table'

var mount = document.querySelectorAll('div.demo-mount');

const columns = [
  {
    name: 'First Name',
    key: 'firstName',
    editor: false,
  },
  {
    name: 'Last Name',
    key: 'lastName',
    editor: false,
  },
  {
    name: 'Updated',
    key: 'updated',
    editor: false,
  },
];
var objects = [
  {id: 1, firstName: 'John', lastName: 'Doe', updated: +(new Date()),},
  {id: 2, firstName: 'Andrew', lastName: 'Ang', updated: +(new Date()),},
  {id: 3, firstName: 'Craig', lastName: 'Handley', updated: +(new Date()),},
  {id: 4, firstName: 'Luke', lastName: 'Hotkins', updated: +(new Date()),},
];

ReactDOM.render(
  <ObjectTable
    columns={columns}
    objects={objects}
    actions={[]}
  />,
  mount[0]
);
