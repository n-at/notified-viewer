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

    var page = parseInt(req.param('page')) || 0;
    var template = req.param('tpl');
    var pageSize = parseInt(config.get('page_size'));

    var filter = template ? {template: template} : {};

    Notification.find({})
        .select('template')
        .exec(function(err, docs) {
            if(err) throw err;

            //all available templates
            var templateCollection = {};
            for(var i = 0; i < docs.length; i++) {
                templateCollection[docs[i].template] = true;
            }
            templateCollection = Object.keys(templateCollection);

            Notification.count(filter, function(err, count) {
                if(err) throw err;

                var pages = count / pageSize + (count % pageSize ? 1 : 0);
                var skip = pageSize * page;

                var error = [];
                if(count == 0) {
                    error.push('No notifications found');
                }
                if(skip > count) {
                    error.push('Page number is out of bounds');
                }
                if(skip < 0) {
                    error.push('Negative page number');
                }

                if(error.length) {
                    res.render('view.twig', {error: error});
                } else {
                    Notification.find(filter)
                        .sort('-dateCreated')
                        .limit(pageSize)
                        .skip(skip)
                        .exec(function(err, notifications) {
                            if(err) throw err;

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

                            res.render('view.twig', {
                                notifications: collection,
                                page: page,
                                pages: pages,
                                tpl: template,
                                templateCollection: templateCollection,
                                error: error
                            });
                        });
                }
            });
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
