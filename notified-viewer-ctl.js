var daemon = require('daemonize2').setup({
    main: 'notified-viewer.js',
    pidfile: 'notified-viewer.pid',
    name: 'notified-viewer'
});

switch(process.argv[2]) {
    case 'start':
        daemon.start();
        break;

    case 'stop':
        daemon.stop();
        break;

    case 'restart':
        daemon.stop(function() {
            daemon.start();
        });
        break;

    case 'status':
        var pid = daemon.status();
        if(pid) {
            console.log('notified-viewer is running with pid:%s', pid);
        } else {
            console.log('notified-viewer is not running');
        }
        break;

    case 'version':
        console.log('notified-viewer ' + require('./package').version);
        break;

    default:
        console.log('Usage: [start|stop|restart|status|version]');
}
