var express = require('express');
var router = express.Router();

var config = require('../config');
var Notification = require('../libs/models/notification').Notification;
var notificationUtil = require('../libs/notifications');


router.get('/', function(req, res, next) {
    var session = req.session;
    if(session && session.auth) {
        listNotifications(req, res, next);
    } else {
        res.render('index.twig', {
            error: req.param('error') !== undefined
        });
    }
});


router.post('/login', function(req, res) {
    var login = req.param('login');
    var password = req.param('password');

    if(login && login === config.get('username') &&
        password && password === config.get('password')
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


function listNotifications(req, res, next) {

    var currentPage = parseInt(req.param('page')) || 0;
    var template = req.param('tpl');
    var status = req.param('status');
    var notificationsPerPage = parseInt(config.get('page_size'));

    var filter = {};

    if(template) filter.template = template;
    if(status) filter.status = status;

    Notification.find({})
        .select('template')
        .exec(function(err, docs) {
            if(err) {
                next(err);
                return;
            }

            //all available templates
            var templateCollection = {};
            for(var i = 0; i < docs.length; i++) {
                templateCollection[docs[i].template] = true;
            }
            templateCollection = Object.keys(templateCollection);

            Notification.count(filter, function(err, count) {
                if(err) {
                    next(err);
                    return;
                }

                var pagesCount = count / notificationsPerPage + (count % notificationsPerPage ? 1 : 0);
                var skip = notificationsPerPage * currentPage;

                var error = notificationUtil.countErrors(count, skip);
                if(error.length) {
                    next(new Error(error));
                    return;
                }

                findNotifications(filter, notificationsPerPage, skip, function(err, notifications) {
                    if(err) {
                        next(err);
                        return;
                    }
                    res.render('view.twig', {
                        notifications: notificationUtil.buildCollection(notifications),
                        count: count,
                        page: currentPage,
                        pages: pagesCount,
                        tpl: template,
                        status: status,
                        templateCollection: templateCollection
                    });
                });
            });
        });
}


function findNotifications(filter, limit, skip, callback) {
    Notification.find(filter)
        .sort('-dateCreated')
        .limit(limit)
        .skip(skip)
        .exec(callback);
}


module.exports = router;
