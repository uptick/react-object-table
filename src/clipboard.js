function deserializeCells(clipboardData) {
  let gridData = clipboardData.getData('react/object-grid')
  if (gridData) {
    return JSON.parse(gridData)
  }
  let tabbedData = clipboardData.getData('text/plain')
  if (tabbedData) {
    let rows = []
    let lines = tabbedData.split('\n')
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      let columns = []
      let tabs = lines[lineIndex].split('\t')
      for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
        columns.push(tabs[tabIndex])
      }
      rows.push(columns)
    }
    return rows
  }
  return []
}

function stringValue(value) {
  switch (typeof value) {
    case 'number':
      return value.toString()

    case 'object':
      if (Array.isArray(value)) {
        let stringValue = ''
        for (let valueIndex = 0; valueIndex < value.length; valueIndex++) {
          stringValue += stringValue(value[valueIndex])
          if (valueIndex < value.length - 1) {
            stringValue += ', '
          }
        }
        return stringValue
      }

      if (value === null) {
        return ''
      } else {
        return 'object'
      }

    case 'boolean':
      if (value) {
        return 'true'
      } else {
        return 'false'
      }

    case 'string':
      return value
  }
  return ''
}

export {
  deserializeCells,
  stringValue,
}
