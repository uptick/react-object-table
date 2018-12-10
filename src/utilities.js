function dictCount(dict) {
  let count = 0
  for (const _ in dict) {
    count++
  }
  return count
}

function dictFirstKey(dict) {
  for (const dictKey in dict) {
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

function isDifferent(objectA, objectB, exemptions) {
  for (const key in objectA) {
    if (exemptions && key in exemptions) {
      continue
    }
    if (JSON.stringify(objectB[key]) !== JSON.stringify(objectA[key])) {
      return true
    }
  }
  return false
}

export {
  dictCount,
  dictFirstKey,
  cellIsEditable,
  isDifferent,
}
