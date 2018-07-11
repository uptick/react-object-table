function dictCount(dict) {
  let count = 0
  for (let _ in dict) {
    count++
  }
  return count
}

function dictFirstKey(dict) {
  for (let dictKey in dict) {
    return dictKey
  }
  return undefined
}

function cellIsEditable(object, column) {
  const { isReadOnly, editor } = column
  const editorIsSet = editor !== false
  const readOnly = typeof isReadOnly === 'function' ? isReadOnly(object) : (isReadOnly === true)
  return editorIsSet && !readOnly
}

export {
  dictCount,
  dictFirstKey,
  cellIsEditable,
}
