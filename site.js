$('code.script').each(function(index, element) {
  var jqElement = $(element);
  var source = jqElement.data('source');
  var sourceLink = $('<a>View the source</a>');
  sourceLink.attr('href', source);
  sourceLink.addClass('source-link');
  sourceLink.insertBefore(jqElement);
  $.ajax({
    url: source,
    type: 'GET',
    success: function(response) {
      jqElement.text(response);
    },
  });
});
