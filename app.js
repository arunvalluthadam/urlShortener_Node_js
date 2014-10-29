
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/company');

var Schema = new mongoose.Schema({
	_id: String,
	shorturl: String
});

var user = mongoose.model('urls', Schema);

app.get('/:shorturl', function(req, res) {
	user.find({shorturl: req.params.shorturl}, function(err, result) {
		if(err) res.json(err);
		else res.redirect(result._id);
	});
});

app.get('/user/:shorturl', function(req, res) {
	user.find({shorturl: req.params.shorturl}, function(err, doc) {
		if(err) res.json(err);
		else res.render('view-one', {user: doc[0]});
	});
});

app.get('/show', function(req, res) {
	user.find({}, function(err, docs) {
		if(err) res.json(err);
		else res.render('index', {users: docs});
	});
});

app.get('/', function(req, res) {
	res.render('enter-longurl');
});

app.post('/new', function(req, res) {
	new user({
		_id: req.body.longurl,
		shorturl: makeid()
	}).save(function(err, doc) {
		if(err) res.json(err);
		else res.redirect('/show');
	});
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
