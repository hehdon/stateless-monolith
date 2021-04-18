import Joi from 'joi';
import Base from './base.js';

export class Dummy extends Base {
  static slug = 'dummy';
  static schema = Joi.object({
    downloader: Joi.string().required(),
    payload: Joi.any().required(),
  });
  
  getNextLink(next) {
    return {
      type: this.config.downloader,
      payload: this.config.asJSON
        ? JSON.parse(this.config.payload)
        : this.config.payload,
    };
  }
}

export default Dummy;
