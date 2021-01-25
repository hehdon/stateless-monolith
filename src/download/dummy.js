const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const Base = require('./base');

class Dummy extends Base {
  static slug = 'dummy';

  async download() {
    const p = path.join(os.tmpdir(), 'animed-dummy.txt');

    await fs.writeFile(p, `==== Animed Dummy Downloader ====\n${
      typeof this.payload === 'string' ? this.payload : JSON.stringify(this.payload, null, 2)
    }`);

    console.log('[Dummy Downloader]', this.payload);
    return p;
  }
}

module.exports = Dummy;
