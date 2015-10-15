//get access to http node.js library
var http = require('http');

//get access to the querystring
var qs = require('querystring');

//get access to the fs library
var fs = require('fs');

//get the url
var url = require('url');

//point to port on local server
var PORT = 3000;

//template html built for dynamically writing new data post
var dataBuild = require('./template');

//===================================Server request=======================

//creating server
var server = http.createServer(function(request, response){
  var dataBuffer = '';

  //comparison test to check for request or response
  //if response then send data set to client
  if(request.method === 'GET') {

    //conditional if URL is root that it sends index.html
    if(request.url === '/') {
      fs.readFile('./public/index.html', {encoding: 'UTF-8'}, function(err, buffer){
        if(err) throw err;
        response.end(buffer);
      });

    //conditional if URL is in library that it sends request.url.html
    } else {
      fs.readFile('./public/'+request.url, {encoding: 'UTF-8'},function(err, buffer){
        console.log('code is beautiful');
        if(err) throw err;

        //return err 404 index.html
        fs.readFile('./public/404.html', {encoding: 'UTF-8'}, function(err, buffer) {
          if(err) throw err;
          response.writeHead(404, {'Content-Type': 'text/plain'});
          response.end(buffer);
        });

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
    // var dataPost =
    //   '<html lang="en">' +
    //   '<head>' +
    //     '<meta charset="UTF-8">' +
    //     '<title> The Elements -' + data.elementName + '</title>' +
    //     '<link rel="stylesheet" href="/css/styles.css">' +
    //   '</head>' +
    //   '<body>' +
    //     '<h1>' + data.elementName + '</h1>' +
    //     '<h2>' + data.elementSymbol + '</h2>' +
    //     '<h3>' + data.elementAtomicNumber + '</h3>' +
    //     '<p>' + data.elementDescription + '</p>' +
    //     '<p><a href="/">back</a></p>' +
    //   '</body>' +
    //   '</html>';
    // var addElement =

    //conditional to test if request is a POST
    if(request.method === 'POST') {

    //post data dynamically based on elementName
    //if elementName request is NOT a file ---> writeFile
    //save method to a variable and run it through writefile
      if(request.url === '/elements') {
        fs.writeFile('./public/'+data.elementName+'.html', dataBuild(data), function(err){
          if(err) throw err;
          response.end(dataBuild(data));
          console.log('Data has been stored');
        });
        fs.writeFile('./public/index.html', addElement, {encoding: 'UTF-8'}, function(err){
          if(err) throw err;
          console.log('Added ' + data.elementName + ' to index.html');
        });
      }
    };
  });

});

//listening to calls on server socket
server.listen(PORT, function() {
  console.log('server listening on port ' + PORT);
});


