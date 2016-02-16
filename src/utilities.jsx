var dict_count = function(dict) {
  var count = 0;
  for (var dictKey in dict)
    count++;
  return count;
};

var dict_first = function(dict) {
  for (var dictKey in dict)
    return dict[dictKey];
  return undefined;
};

module.exports = {
  dict_count: dict_count,
  dict_first: dict_first,
};
