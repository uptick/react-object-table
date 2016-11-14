var config = require('./webpack.config');

config.externals = {};
config.output.library = 'objectTable';
config.output.libraryTarget = 'var';

module.exports = config;
