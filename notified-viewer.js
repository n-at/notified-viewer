var log = require('./libs/logger')(module);

var Notification = require('./libs/models/notification').Notification;

Notification.find({}, function(err, items) {
    if(err) throw err;

    for(var i = 0; i < items.length; i++) {
        var notification = items[i];
        log.info(notification.body);
    }

    process.exit();
});
