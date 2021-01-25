const fs = require('fs').promises;
const path = require('path');
const WebTorrent = require('webtorrent');
const Base = require('./base');

class Torrent extends Base {
  static slug = 'torrent';

  download() {
    return new Promise((resolve, reject) => {
      const client = new WebTorrent();
  
      client.on("error", e => {
        client.destroy();
        reject(e);
      });
  
      client.add(this.payload, torrent => {
        this.path = torrent.path;
        const files = torrent.files.map(v => v.path);
  
        torrent.on("done", () => {
          client.destroy();
          resolve(path.join(this.path, files[0]));
        });
      });
    });
  }

  clean() {
    return fs.rmdir(this.path);
  }
}

module.exports = Torrent;