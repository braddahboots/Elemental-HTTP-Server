//get access to http node.js library
var http = require('http');

//get access to the querystring
var qs = require('querystring');

//get access to the fs library
var fs = require('fs');

var url = require('url');

//point to port on local server
var PORT = 3000;

//===================================Server request=======================

//creating server
var server = http.createServer(function(request, response){
  var dataBuffer = '';

  //comparison test to check for request or response
  //if response then send data set to client
  if(request.method === 'GET') {
    if(request.url === '/') {
      fs.readFile('./public/index.html', {encoding: 'UTF-8'}, function(err, buffer){
        if(err) throw err;
        response.end(buffer);
      });
    } else {
      fs.readFile('./public/'+request.url, {encoding: 'UTF-8'},function(err, buffer){
        console.log('code is beautiful');
        if(err) throw err;
        response.end(buffer);
      });
    }
  }

  //collect data that has been sent from the client
  request.on('data', function(data) {
    dataBuffer += data;
  });

  //parse the data string to return an object
  request.on('end', function() {
    var data = qs.parse( dataBuffer.toString() );
    var dataPost =
      '<html lang="en">' +
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

    //post data dynamically based on elementName
    //if elementName request is NOT a file ---> writeFile
    //save method to a variable and run it through writefile
    if(request.url === '/elements') {
      fs.writeFile('./public/'+data.elementName+'.html', dataPost, function(err){
        if(err) throw err;
        response.end(dataPost);
        console.log('Data has been stored');
      });
    }
  });

});

//listening to calls on server socket
server.listen(PORT, function() {
  console.log('server listening on port ' + PORT);
});


