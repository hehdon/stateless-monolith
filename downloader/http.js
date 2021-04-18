import fs from 'fs';
import path from 'path';
import os from 'os';
import fetch from 'node-fetch';
import mime from 'mime';
import Base from './base.js';

export class HTTP extends Base {
  static slug = 'http';

  download() {
    const url = typeof this.payload === 'string' || this.payload instanceof URL
      ? this.payload
      : this.payload.url;
    
    return fetch(new URL(url), typeof this.payload === 'object' ? this.payload : {})
      .then(res => new Promise((resolve, reject) => {
        if (!res.ok) {
          throw `{${res.status}} Unable to download ${url}`;
        }

        const ext = path.parse(new URL(url).pathname).ext
          || `.${mime.getExtension(res.headers.get('content-type'))}`;

        this.filename = path.join(
          os.tmpdir(), 
          'hehdon-http-downloader' + ext
        );

        res.body.on('error', reject);
        res.body.pipe(fs.createWriteStream(this.filename))
          .on('error', reject)
          .on('finish', () => resolve(this.filename));
      }));
  }

  clean() {
    if (!this.filename) {
      return super.clean();
    }

    return fs.promises.unlink(this.filename)
      .catch(() => true);
  }
}

export default HTTP;