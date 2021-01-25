const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mime = require('mime');
const Base = require('./base');

class Torrent extends Base {
  static slug = 'http';

  download() {
    const url = new URL(this.payload);

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error(`Invalid protocol ${url.protocol}`);
    }

    return new Promise((resolve, reject) => {
      (url.protocol === 'http:' ? http : https).get(url, res => {
        if (res.statusCode >= 400) {
          return reject();
        }

        const ext = path.parse(url.pathname).ext ?? `.${mime.getExtension(res.headers['content-type'])}`;
        const file = path.join(
          os.tmpdir(), 
          'animed-http-downloader' + ext
        );
        
        res.on('error', reject);
        res.pipe(fs.createWriteStream(file))
          .on('error', reject)
          .on('finish', () => resolve(file));
      });
    });
  }
}

module.exports = Torrent;