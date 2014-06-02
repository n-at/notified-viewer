var express = require('express');
var router = express.Router();

var config = require('../config');


router.get('/', function(req, res) {
    var session = req.session;
    if(session && session.auth) {
        listNotifications(req, res);
    } else {
        res.render('index.twig', {
            error: req.param('error') !== undefined
        });
    }
});


router.post('/login', function(req, res) {
    var login = req.param('login');
    var password = req.param('password');

    if(login && login === config.get('username')
        && password && password === config.get('password')
    ) {
        req.session.auth = true;
        res.redirect('/');
    } else {
        res.redirect('/?error');
    }
});


router.get('/logout', function(req, res) {
    req.session.auth = false;
    res.redirect('/');
});


function listNotifications(req, res) {
    res.render('view.twig', {});
}


module.exports = router;
