//get access to the fs library
var fs = require('fs');

function writeIndex(elements) {
  console.log('hello', elements);
  var newList = elements.map(function(element
    ) {
    return ('<li>'+
            '<a href="{{ filePath }}">'+
            '{{ elementName }}'+
            '</a>'+
            '</li>').replace('{{ filePath }}', element.toLowerCase()+'.html').replace('{{ elementName }}', element);
  });

  fs.readFile('./template/template.index.html', function(err, template) {
    if(err) throw err;

    var rendered = template.toString().replace('{{ listOfElements }}', newList.join('\n'));
    fs.writeFile('./public/index.html', rendered, function(err) {
      if(err) throw err;
    });
  });
}

module.exports = writeIndex;