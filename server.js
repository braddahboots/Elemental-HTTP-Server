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
var dataBuild = require('./templateElement');

//template elementList builder for dynamically adding elements to index.html
var writeIndex = require('./template/templateList');

//on server load elements is null - will be set to an array
var elements = null;

//=============================Server request=======================

//iterate over file directory and pull element names
fs.readdir('./public', function(err, files) {
  // console.log(files);
  if(err) throw err;
    elements = files.filter(function(file) {
    // console.log(file);
    return (file.indexOf('.html') > 1 && file !== 'index.html' && file !== '404.html');
  }).map(function(elementName) {
    return (elementName.substr(0,elementName.indexOf('.html')));
  }).map(function(lowerCase) {
    return (lowerCase.substr(0,1).toUpperCase() + lowerCase.substr(1));
  });
  // console.log(elements);
  //calls function that creates dynamic list with element names from directory
  writeIndex(elements);
});

//=============================Creating Server=====================
var server = http.createServer(function(request, response) {
  var dataBuffer = '';


  //collect data that has been sent from the client
  request.on('data', function(data) {
    dataBuffer += data;
  });

  //parse the data string to return an object
  request.on('end', function() {
    var data = qs.parse( dataBuffer.toString() );

    //===========================POST Request=========================
    //post data dynamically based on elementName
    //if elementName request is NOT a file ---> writeFile
    //save method to a variable and run it through writeFile
      if(request.method === 'POST' && request.url === '/elements') {
        fs.writeFile('./public/'+data.elementName+'.html', dataBuild(data), function(err) {

          if(err) throw err;

          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(JSON.stringify({'success': true}));
          console.log('Data has been stored');

          if(elements.indexOf(data.elementName) === -1) {
            //update of element array with new element names
            elements.push(data.elementName);
            //update indexHTML
            writeIndex(elements);
          }
          console.log('array', elements);
        });
    }
    //===========================PUT Request=========================
    //conditional to test if request is a PUT
    if(request.method === 'PUT') {
      fs.writeFile('./public/'+data.elementName+'.html', dataBuild(data), function(err) {

        //throw error 500 if input element doesn't exist within directory
        if(err) throw err;
          response.writeHead(500, {'error': 'resource /'+data.elementName+'.html', 'Content-Type': 'application/json'});

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({'success': true}));
        console.log('File was updated');
      });
    }

    //===========================Delete Request======================
    //Conditional that will remove a data file from the server
    if(request.method === 'DELETE') {
      fs.unlink('./public/'+data.elementName+'.html', function(err) {
        if(err) throw err;
          response.writeHead(500, {'error': 'resource /'+data.elementName+'.html', 'Content-Type': 'application/json'});

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({'success': true}));
        console.log('Element was deleted');
      });
    }

    //===========================Get Request=========================
    //Conditional that returns the data file to client
    if(request.method === 'GET' && request.url === '/') {
        fs.readFile('./public/index.html', {encoding: 'UTF-8'}, function(err, buffer){
          if(err) throw err;
          response.end(buffer);
        });

      //conditional if URL is in library that it sends request.url.html
    } else {
        fs.readFile('./public/'+request.url, {encoding: 'UTF-8'},function(err, buffer){
          console.log('code is beautiful');
          if(err) {
            if(err.code === 'ENOENT') {
            //return err 404 index.html
            fs.readFile('./public/404.html', {encoding: 'UTF-8'}, function(err, buffer) {
              if(err) throw err;
              response.writeHead(404, {'Content-Type': 'text/plain'});
              response.end(buffer);
            });
              } else {
                throw err;
              }
          }
          response.end(buffer);
        });
    }
  });
});

//listening to calls on server socket
server.listen(PORT, function() {
  console.log('server listening on port ' + PORT);
});


