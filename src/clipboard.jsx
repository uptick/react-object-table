var deserialize_clipboard_cells = function(clipboardData) {
  var gridData = clipboardData.getData('react/object-grid');
  if (gridData) {
    return JSON.parse(gridData);
  }
  var tabbedData = clipboardData.getData('text/plain');
  if (tabbedData) {
    var rows = [];
    var lines = tabbedData.split('\n');
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      var columns = [];
      var tabs = lines[lineIndex].split('\t');
      for (var tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
        columns.push(tabs[tabIndex]);
      }
      rows.push(columns);
    }
    return rows;
  }
  return [];
};

module.exports = {
  deserialize_clipboard_cells: deserialize_clipboard_cells,
};
