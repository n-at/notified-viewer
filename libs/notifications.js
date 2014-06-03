
var jsonRenderer = require('./jsonRenderer');

function notificationStatus(status) {
    switch(status) {
        case 0: return 'Not sent yet';
        case 1: return 'Sent successfully';
        case 2: return 'Error';
        default: return 'Unknown';
    }
}


function countErrors(count, skip) {
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
    return error;
}


function buildCollection(notifications) {
    var collection = [];
    for(var i = 0; i < notifications.length; i++) {
        var notification = notifications[i];
        collection.push({
            'template': notification.template,
            'dateCreated': notification.dateCreated,
            'dateSent': notification.dateSent ? notification.dateSent : '[not sent]',
            'status': notificationStatus(notification.status),
            'body': jsonRenderer(notification.body)
        });
    }
    return collection;
}


module.exports = {
    status: notificationStatus,
    countErrors: countErrors,
    buildCollection: buildCollection
};
