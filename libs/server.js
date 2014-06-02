var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var config = require('../config');
var log = require('./logger')(module);

var routes = require('../routes/index');

var app = express();

//templates
app.set('views', path.join(config.get('root_path'), 'views'));
app.set('twig options', {
    strict_variables: false
});

//body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());
app.use(session({
    secret: config.get('session_secret')
}));

//static files
app.use(express.static(path.join(config.get('root_path'), 'public')));

//routes
app.use('/', routes);

//404
app.use(function(req, res, next){
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

//custom error handler
app.use(function(err, req, res, next) {
    log.error("Error occurred while processing request (%s)", err.message);
    res.statusCode = 500;
    res.render('error.twig', {'error': err});
});

//start server
app.listen(config.get('port'), config.get('host'), function(err) {
    if(err) {
        log.error('Error occurred while starting notified-viewer (%s)', err.message);
        process.exit(13);
    }
    log.info('notified-viewer started');
});
