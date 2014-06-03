
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

module.exports = {
    status: notificationStatus,
    countErrors: countErrors
};