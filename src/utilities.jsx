var dict_count = function(dict) {
  var count = 0;
  for (var dictKey in dict)
    count++;
  return count;
};

var dict_first_key = function(dict) {
  for (var dictKey in dict)
    return dictKey;
  return undefined;
};

module.exports = {
  dict_count: dict_count,
  dict_first_key: dict_first_key,
};
