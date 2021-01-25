const Kernel = require('./kernel');
const config = require('./config');

new Kernel(config).cron();
