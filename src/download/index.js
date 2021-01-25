const fs = require('fs');
const path = require('path');

module.exports = fs.readdirSync(__dirname)
  .filter(v => !['index.js', 'base.js'].includes(v))
  .map(v => require(path.join(__dirname, v)));
