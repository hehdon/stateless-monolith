const Joi = require('joi');
const Parser = require('rss-parser');
const Base = require('./base');

class Nyaa extends Base {
  static slug = 'nyaa';
  static schema = Joi.object({
    search: Joi.string().required(),
    user: Joi.string(),
  });

  constructor(...args) {
    super(...args);

    if (typeof process.env.ANIMED_NYAA_ENDPOINT === 'undefined') {
      throw new Error('ANIMED_NYAA_ENDPOINT is required');
    }
    this.endpoint = process.env.ANIMED_NYAA_ENDPOINT;
  }
  
  async getLink() {
    const next = await this.anime.getNextEp();

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
    const url = new URL(this.endpoint);

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

module.exports = Nyaa;