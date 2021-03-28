const Joi = require('joi');
const path = require('path');
const fetch = require('node-fetch');
const Base = require('./base');

class Subsplease extends Base {
  static slug = 'subsplease';
  static schema = Joi.number();

  constructor(...args) {
    super(...args);

    if (typeof process.env.ANIMED_SUBSPLEASE_ENDPOINT === 'undefined') {
      throw new Error('ANIMED_SUBSPLEASE_ENDPOINT is required');
    }
    this.endpoint = process.env.ANIMED_SUBSPLEASE_ENDPOINT;
  }
  
  async getLinkNext(next) {
    const url = new URL(this.endpoint);
    url.searchParams.append('f', 'show');
    url.searchParams.append('tz', 'Europe/Paris');
    url.searchParams.append('sid', this.config);
    const data = await fetch(url).then(r => r.json());

    const ep = Object.values(data.episode).find(v => v.episode === next || (!isNaN(Number(next)) && Number(v.episode) === Number(next)));

    if (typeof ep === 'undefined') {
      return undefined;
    }

    const link = ep.downloads.sort((a, b) => b.res - a.res)[0].magnet;

    return {
      type: 'torrent',
      number: next,
      filename: this.anime.getFilename(next),
      payload: link,
    };
  }
}

module.exports = Subsplease;