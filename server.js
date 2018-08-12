var fs = require('fs')
var express = require('express');
var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var ipAddress = getIPAddress();
var bodyParser = require('body-parser');
var guid = require('./guid')


http.listen(4000, function(){
  console.log('listening on '+ipAddress+':4000  ......');
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing

var STATIC_FOLDER = 'crowdpage';
var RESULT_FOLDER = 'result';

var workerCode = ''
app.use(express.static(path.join(__dirname, STATIC_FOLDER)));


app.get('/getCode', function(res, req){
  workerCode = guid()
  req.send(workerCode)
})

app.post('/', function (req, res) {
  // console.log(req.body);
  createFile(req.body)
  res.send('POST request to the homepage')
})

app.post('/saveData', function (req, res) {
  usersRef.push(req.body);
  ref.once("value").then(function(snapshot) {
    // console.log(typeof(snapshot));
    var keyArray = Object.keys(snapshot.val())
    // console.log(keyArray);
    var lastKey = keyArray[keyArray.length - 1]
    res.send(lastKey)
    // console.log(snapshot.val());
  });
  // createDir(req.body)
});
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))

function createDir(data) {
  var dirName = data.name;
  fs.mkdir(path.join(RESULT_FOLDER, dirName), function(err) {
    if(err) console.error(err)
    else console.log('Dir created!')
  })
}

function createFileNameSize(filePath, size, content) {
  return new Promise(function(res, rej) {
    var buf = Buffer.alloc(size, content)

    fs.writeFile(filePath, buf, function(err) {
      if(err) console.error(err)
      else {
        res();
        console.log('File created!')
      }
    })
  })
}

function createFile(data) {
  var name = data.name
  var kind = data.kind
  var filename = name + '.' + kind
  var filePath = path.join(RESULT_FOLDER, filename)
  var cdate = data.cdate
  var mdate = data.mdate
  var content =data.content
  var size = 1024*1024*parseInt(data.size)
  createFileNameSize(filePath, size, content).then(function() {
    var atime = new Date(cdate)
    var mtime = new Date(mdate)
    console.log('done');
    fs.utimes(filePath, atime, mtime, function(err){
      if(err) console.error(err)
      else console.log('Time changed!')
    })
  })

}

function getIPAddress() {
	var os = require('os');

	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
				var address = interfaces[k][k2];
					if (address.family === 'IPv4' && !address.internal) {
					    addresses.push(address.address);
				}
	    }
	}

	return addresses[0];
}
// fs.writeFile('message.txt', 'Hello Node.js', (err) => {
//   if (err) throw err;
//   console.log('The file has been saved!');
// });

// fs.writeFile('file1.pdf', new Buffer(1024*1024*1024));
//
// var atime = new Date(1995, 11, 17)
// var mtime = new Date('December 17, 1995 03:24:00')
//
// fs.utimes('file.pdf', atime, mtime,function(err){
//     if(err) console.error(err)
//     else console.log('Done!')
// })
