var formidable = require('formidable');
var express = require('express');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
var fs = require('fs');
var cors = require('cors');
var util = require('util');
var app = express();

app.use(cors());
//app.use(app.router);

app.listen(3303, '192.168.13.165', function() {
    console.log('Server Start.!!!!');
});

app.post('/', function (req, res) {
	console.log('post!!!');
//        fs.readFile('index.html', function (error, data) {
                
				//'Access-Control-Allow-Origin': '*',
				//'Access-Control-Allow-Headers': 'X-Requested-With',
//				res.writeHead(200, {
//					'content-type': 'text/plain'        
//				});
  //              res.end(data, function (error) {
    //                    console.log(error);
      //          });
       // });
	var temp = '{id:12}';
	res.end(temp);
//	res.end(temp, function(error){
//		console.log('error :',error);
//	});
});

app.post('/upload', function(req, res) {
	console.log('post!!!');
    var form = new formidable.IncomingForm(),
    files = [],
    fields = [];
    form.keepExtensions = true;
    form.uploadDir = '/data/file_storage/';
    form
      .on('field', function(field, value) {    // field ??寃쎌슦 (input ??type ??text ??寃쎌슦 ??
        console.log('[field] ' + field, value);
        fields.push([field, value]);
      })
      .on('file', function(field, file) { // file ??寃쎌슦 (input??type ??file??寃쎌슦)
        console.log('[file] ' +  field, file);
        fs.rename(file.path, form.uploadDir + '/' + file.name);    // file 紐?蹂<80>寃?
        files.push([field, file]);
      })
      .on('end', function() {
        console.log('-> upload done');
        //'Access-Control-Allow-Origin': '*',
		//'Access-Control-Allow-Headers': 'X-Requested-With',
		res.writeHead(200, {
		    'content-type': 'text/plain'
		});
        //res.write('received fields:\n\n '+util.inspect(fields));
        //res.write('\n\n');
        //res.end('received files:\n\n '+util.inspect(files));
       	res.end();
      })
      .on('progress', function(a, b) {    // progress event
        console.log('[progress] ' + a + ', ' + b);
      })
      .on('error', function(error) {
        console.log('[error] error : ' + error);
      });

    form.parse(req, function(error, fields, files) {
          console.log('[parse()] error : ' + error + ', fields : ' + fields  + ', files : ' + files);
    });
});

app.get('/download/:id', function(req, res) {
	console.log('download Here!!!!');
	var filename = req.params.id;
	var filepath = '/data/file_storage/'+filename;
	res.download(filepath);
        //res.write(filepath);
        //res.end();
          
});


		
/*
app.use(bodyParser());
//app.use(methodOverride());


app.listen(3301, '192.168.13.165', function() {
    console.log('192.168.13.165:3301 Server Start.!!!!');
});

app.get('/', function (req, res) {
	fs.readFile('test.html', function (error, data) {
	console.log('test1');
		//res.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin': '*'});
		res.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin': '*'});
		res.end(data, function(success){
			console.log(success);
		},function (error) {
			console.log(error);
		});
	});
});

app.post('/upload', function(req, res) {
	console.log('test2');
	console.log(req.files);
	console.log(req.files.uploadFile.path);
	
    fs.readFile(req.files.uploadFile.path, function (error, data) { 
		// 저장할 파일 경로를 지정 합니다.
		var filePath = "\\data\\file_storage" + req.files.uploadFile.name;
		// 파일 저장 및 에러처리
		fs.writeFile(filePath, data, function (error) { 
			if (error) {
				throw err;
			} else {
				res.redirect("back");
			}
		});
	});
});
*/
