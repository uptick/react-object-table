function dict_count(dict) {
  var count = 0;
  for (var dictKey in dict)
    count++;
  return count;
}

function dict_first_key(dict) {
  for (var dictKey in dict)
    return dictKey;
  return undefined;
}

export {
  dict_count,
  dict_first_key,
}
