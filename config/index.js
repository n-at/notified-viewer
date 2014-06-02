var nconf = require('nconf');
var path = require('path');
var mkdirp = require('mkdirp');

//load config from environment variables, commandline arguments and config.json file
nconf.env().argv().file(path.join(__dirname, 'config.json'));

var root = path.join(__dirname, '..');
nconf.set('log_path', path.join(root, 'logs'));

mkdirp.sync(nconf.get('log_path'));

module.exports = nconf;
