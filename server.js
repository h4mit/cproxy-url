var app 	   = require('express')();
var url 	   = require('url');
var bodyParser = require('body-parser');
var rq 		   = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Content-Type', 'application/json');
  res.header('Accept', 'application/json');
  next();
});

var proxy_url = "10.25.2.101";


app.get('/*', function(req, res, next){
	var _url = url.parse(req.url);
	var url_ = "";
		console.log();
		if(_url.query == null ){
			url_ = 'https://'+proxy_url+_url.pathname;
			console.log('GET : '+url_);
		}else {
			url_ = 'https://'+proxy_url+_url.pathname+'?'+_url.query;
			console.log('GET : '+url_);
			
		}
	rq(url_, function (err, response, body) {
		if(!err && response.statusCode == 200) {
			var obj = JSON.parse(body);
			res.json(obj);

		}else
			res.json(err);
	});
});

app.put('/*', function(req, res, next){
	var _url = url.parse(req.url).pathname;
	console.log('PUT : https://'+proxy_url+_url);
	rq({ headers: [{'Content-Type': ' application/json',
					    'Accept'      : 'application/json'}],
			  url    :'https://'+proxy_url+_url,
			  method : 'PUT',
			  json   : req.body
			}, function (err, response, body) {
		if(!err && response.statusCode == 200) {
			res.json(body);

		}else
			res.json(err);
	});
});



app.delete('/*', function(req, res, next){
	var _url = url.parse(req.url).pathname;
	console.log('DELETE : https://'+proxy_url+_url);
	rq({ headers: [{'Content-Type': ' application/json',
					    'Accept'      : 'application/json'}],
			  url    :'https://'+proxy_url+_url,
			  method : 'DELETE'
			}, function (err, response, body) {
		if(!err && response.statusCode == 200) {
			res.json(body);
		}else
			res.json(err);
	});
});

app.post('/*', function(req, res, next){
	var _url = url.parse(req.url).pathname;
	console.log('POST : https://'+proxy_url+_url);
	console.log(req.body);
	rq({ headers: [{'Content-Type': ' application/json',
					    'Accept'      : 'application/json'}],
			  url    :'https://'+proxy_url+_url,
			  method : 'POST',
			  json   : req.body
			}, function (err, response, body) {
		if(!err && response.statusCode == 200) {
			//var obj = JSON.parse(body);
			res.json(body);

		}else
			res.json(err);
	});
});



app.listen(8000, function (){	
console.log('welcome to API Proxy server');
console.log('viewed at : http://localhost:8000');
});

 


