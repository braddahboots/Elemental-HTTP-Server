function indexBuild(data) {
  return  '<html lang="en">' +
      '<head>' +
        '<meta charset="UTF-8">' +
        '<title> The Elements -' + data.elementName + '</title>' +
        '<link rel="stylesheet" href="/css/styles.css">' +
      '</head>' +
      '<body>' +
        '<h1>' + data.elementName + '</h1>' +
        '<h2>' + data.elementSymbol + '</h2>' +
        '<h3>' + data.elementAtomicNumber + '</h3>' +
        '<p>' + data.elementDescription + '</p>' +
        '<p><a href="/">back</a></p>' +
      '</body>' +
      '</html>';
}

module.exports = dataBuild;