import path from 'path';
import fetch from 'node-fetch';
import Joi from 'joi';
import { Base } from './base.js';

export class Droso extends Base {
  static slug = 'droso';
  static schema = Joi.string();

  static endpoint = process.env.HEHDON_DROSO_ENDPOINT;
  
  async getLink() {
    const downloaded = await this.getDownloaded();
    const files = await this.getIndexOf();

    const file = files.find(f => !downloaded.includes(f));

    if (typeof file === 'undefined') {
      return undefined;
    }

    return {
      type: 'http',
      filename: path.parse(file).name,
      payload: new URL(path.join(Droso.endpoint, this.config, file)).toString(),
    }
  }

  fetchIndexOf() {
    const url = new URL(path.join(Droso.endpoint, this.config, '/'));

    return fetch(url)
      .then(r => r.text());
  }

  async getIndexOf() {
    const page = await this.fetchIndexOf();

    const regex = /<a href="([^"]+)">/g;
    const files = [];
    for (let match; match = regex.exec(page);) {
      !match[1].startsWith('..') && files.push(match[1]);
    }

    return files;
  }
}

export default Droso;
