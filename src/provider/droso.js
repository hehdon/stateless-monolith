const https = require('https');
const path = require('path');
const Joi = require('joi');
const Base = require('./base');

class Droso extends Base {
  static slug = 'droso';
  static schema = Joi.string();

  constructor(...args) {
    super(...args);

    if (typeof process.env.ANIMED_DROSO_ENDPOINT === 'undefined') {
      throw new Error('ANIMED_DROSO_ENDPOINT is required');
    }
    this.endpoint = process.env.ANIMED_DROSO_ENDPOINT;
  }
  
  async getLink() {
    const downloaded = await this.anime.getDownloaded();
    const files = await this.getIndexOf();

    const file = files.find(f => !downloaded.includes(f));

    if (typeof file === 'undefined') {
      return undefined;
    }

    return {
      type: 'http',
      filename: path.parse(file).name,
      payload: path.join(this.endpoint, this.config, file),
    }
  }

  fetchIndexOf() {
    const url = new URL(path.join(this.endpoint, this.config, '/'));

    return new Promise((resolve, reject) => {
      https.get(url, res => {
        if (res.statusCode >= 400) {
          return reject();
        }
        res.on('error', reject);
        const chunk = [];
        res.on('data', c => chunk.push(c));
        res.on('end', () => resolve(Buffer.concat(chunk).toString()));
      });
    });
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

module.exports = Droso;