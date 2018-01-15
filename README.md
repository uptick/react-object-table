# react-object-table

[![npm version](https://badge.fury.io/js/react-object-table.svg)](http://badge.fury.io/js/react-object-table)
![Downloads](http://img.shields.io/npm/dm/react-object-table.svg?style=flat)

React powered table of objects, designed to be editable and fast.

## Live Demo

Check out the live demo here: http://uptick.github.io/react-object-table/

## Installation

Install the package with npm:

```
npm install react-object-table
```

Then require and use with ES6 imports:

```javascript
import React from 'react'
import ReactDom from 'react-dom'

import ObjectTable from 'react-object-table'

var mount = document.querySelectorAll('div.table-mount');
ReactDom.render(
  <ObjectTable
    columns={[
      {
        name: 'Message',
        key: 'message',
      }
    ]}
    objects={[
      {
        id: 1,
        message: 'Hello world',
      }
    ]}
  />,
  mount[0]
);
```

Optionally, include the built css with an import:

```scss
@import 'node_modules/react-object-table/dist/react-object-table.css';

```

or tag:

```html
<link href="static/node_modules/react-object-table/dist/react-object-table.css" rel="stylesheet">
```

Full reference documentation coming soon. For now, take a look at the reference on the live demo at
http://uptick.github.io/react-object-table/.
