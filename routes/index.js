var express = require('express');
var router = express.Router();

var config = require('../config');
var Notification = require('../libs/models/notification').Notification;


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

    var page = req.param('page') || 0;
    var pages = 50;

    Notification.find({})
        .sort('-dateCreated')
        .limit(config.get('page_size'))
        .skip(config.get('page_size') * page)
        .exec(function(err, notifications) {
        var collection = [];
        for(var i = 0; i < notifications.length; i++) {
            var notification = notifications[i];
            collection.push({
                'template': notification.template,
                'dateCreated': notification.dateCreated,
                'dateSent': notification.dateSent ? notification.dateSent : '[not sent]',
                'status': notificationStatus(notification.status),
                'body': JSON.stringify(notification.body)
            });
        }
        res.render('view.twig', {notifications: collection, page: page, pages: pages});
    });
}


function notificationStatus(status) {
    switch(status) {
        case 0: return 'Not sent yet';
        case 1: return 'Sent successfully';
        case 2: return 'Error';
        default: return 'Unknown';
    }
}


module.exports = router;
