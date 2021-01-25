const Joi = require('joi');
const Base = require('./base');

class Dummy extends Base {
  static slug = 'dummy';
  static schema = Joi.object({
    downloader: Joi.string().required(),
    payload: Joi.any().required(),
  });
  
  async getLink() {
    const next = await this.anime.getNextEp();

    if (typeof next === 'undefined') {
      return undefined;
    }

    return {
      type: this.config.downloader,
      number: next,
      filename: this.anime.getFilename(next),
      payload: this.config.payload,
    }
  }
}

module.exports = Dummy;