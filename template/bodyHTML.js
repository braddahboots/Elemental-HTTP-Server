function bodyBuild() {
  return '<body>' +
        '<h1>' + data.elementName + '</h1>' +
        '<h2>' + data.elementSymbol + '</h2>' +
        '<h3>' + data.elementAtomicNumber + '</h3>' +
        '<p>' + data.elementDescription + '</p>' +
        '<p><a href="/">back</a></p>' +
      '</body>';
}

module.exports = bodyBuild;