import fetch from 'node-fetch';
import Joi from 'joi';
import { Base } from './base.js';

export class Subsplease extends Base {
  static slug = 'subsplease';
  static schema = Joi.number();

  static endpoint = process.env.HEHDON_SUBSPLEASE_ENDPOINT;
  
  async getNextLink(next) {
    const url = new URL(Subsplease.endpoint);
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

export default Subsplease;
