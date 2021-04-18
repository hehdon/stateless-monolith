import Joi from 'joi';
import Parser from 'rss-parser';
import { Base } from './base.js';

export class Nyaa extends Base {
  static slug = 'nyaa';
  static schema = Joi.object({
    search: Joi.string().required(),
    user: Joi.string(),
  });

  static endpoint = process.env.HEHDON_NYAA_ENDPOINT;
  
  async getLinkNext(next) {
    const feed = await new Parser().parseURL(this.url(next));
    const ep = feed.items[0];

    if (typeof ep === 'undefined') {
      return undefined;
    }

    return {
      type: 'torrent',
      number: next,
      filename: this.anime.getFilename(next),
      payload: ep.link,
    };
  }

  url(next) {
    const url = new URL(Nyaa.endpoint);

    url.searchParams.append('page', 'rss');
    url.searchParams.append(
      'q',
      `"${this.config.search.replace('%', next.toString().padStart(2, '0'))}"`
    );

    if (typeof this.config.user !== 'undefined') {
      url.searchParams.append('u', this.config.user);
    }

    return url.toString();
  }
}

export default Nyaa;