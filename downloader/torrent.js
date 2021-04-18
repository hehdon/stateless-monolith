import fs from 'fs';
import path from 'path';
import WebTorrent from 'webtorrent';
import Base from './base.js';

export class Torrent extends Base {
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
    return fs.promises.rmdir(this.path);
  }
}

export default Torrent;