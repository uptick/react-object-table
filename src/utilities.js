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

export {
  dictCount,
  dictFirstKey,
}
