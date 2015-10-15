function listBuild(data) {
  var newElement;
  if(data.elementName) {
    newElement =
  }
  return '<li>'+
     '<a href="/hydrogen.html">Hydrogen</a>' +
   '</li>' +
    '<li>' +
      '<a href="/helium.html">Helium</a>' +
  '</li>' +
    '<li>' +
    data.elementName +
  '</li>';
}

module.exports = listBuild;