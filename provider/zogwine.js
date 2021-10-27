import path from 'path';
import fetch from 'node-fetch';
import Joi from 'joi';
import { Base } from './base.js';

export class Zogwine extends Base {
  static slug = 'zogwine';
  static schema = Joi.object({
    path: Joi.string().required(),
    season: Joi.number().required(),
  });

  static endpoint = process.env.HEHDON_ZOGWINE_ENDPOINT;
  
  async getLink() {
    const eps = (await this.fetchIndexOf()).filter(v => v.season === this.config.season);

    const next = await this.getNextMissing(eps.map(v => v.episode));
    if (next === undefined) {
      return;
    }

    const nextEp = eps.find(v => v.season === this.config.season && v.episode === next);

    return {
      type: 'http',
      filename: this.getFilename(next),
      number: next,
      payload: {
        url: new URL(path.join(Zogwine.endpoint, this.config.path, nextEp.path)).toString(),
        headers: {'Content-Type': `animed (${this._config.name}; s${this.config.season}; e${next})`},
      },
    }
  }

  async fetchIndexOf(p = '/') {
    const realPath = path.join(Zogwine.endpoint, this.config.path, p);
    if (this.cache[realPath]) {
      return this.cache[realPath];
    }

    const url = new URL(realPath);
    const page = await fetch(url, { headers: {'Content-Type': `animed (${this._config.name}; s${this.config.season})`} }).then(r => r.text());

    const regex = /<a href="([^"]+)">/g;
    const files = [];
    for (let match; match = regex.exec(page);) {
      if (match[1].startsWith('..')) {
        continue;
      }

      if (match[1].endsWith('/')) {
        files.push(...await this.fetchIndexOf(path.join(p, match[1])));
      } else {
        const m = match[1].match(/_s(?<season>\d+)e(?<episode>\d+)\.(mkv|mp4|avi)$/i);
        if (m === null) {
          continue;
        }
        files.push({ path: path.join(p, match[1]), season: Number(m.groups.season), episode: Number(m.groups.episode) });
      }
    }

    this.cache[realPath] = files;
    return files;
  }
}

export default Zogwine;
