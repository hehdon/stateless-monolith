import fs from 'fs';
import path from 'path';

export class Base {
  constructor({ config, cache, logger, root }) {
    this._config = config;
    this.config = config[this.constructor.slug];

    this.cache = cache;

    this._root = path.join(root, config.storage.dir);
    if (!this._root.startsWith(root)) {
      throw new Error(`Invalid path "${config.storage.dir}".`);
    }

    this._filename = config.storage.prefix ?? (config.storage.dir.split('/')[0] + '-');
    this.logger = logger;
  }

  async getLink() {
    const next = await this.getNextEp();

    if (next === undefined) {
      return undefined;
    }
    
    this.logger = this.logger.extends(this.logger.c.blueBright(`[Episode ${next}]`));
    this.logger.debug(`Next to download: ${next}`);

    const data = await this.getNextLink(next);
    if (data === undefined) {
      return undefined;
    }

    return {
      filename: this.getFilename(next),
      number: next,
      ...data,
    };
  }

  getNextLink(next) {
    throw new Error('getNextLink not implemented');
  }

  getDownloaded() {
    return fs.promises.readdir(this._root).catch(()=>[]);
  }

  async _getDownloadedEp() {
    return (await this.getDownloaded())
      .map(v => path.parse(v).name)
      .map(v => v.replace(this._filename, ''))
      .map(v => Number(v).toString());
  }

  async getNextEp() {
    const start = this._config.filter?.start ?? 1;
    const end = this._config.filter?.end ?? Infinity;
    const exclude = this._config.filter?.exclude?.map(v => v.toString());
    const include = this._config.filter?.include?.map(v => v.toString()) ?? [];

    const downloaded = await this._getDownloadedEp();
    for (const i of include) {
      if (!downloaded.includes(i)) {
        return i;
      }
    }

    for (let i = start; i <= end; i++) {
      const j = i.toString();

      if (exclude?.includes(j)) {
        continue;
      }

      if (!downloaded.includes(j)) {
        return j;
      }
    }
  }

  async getNextMissing(eps) {
    const start = this._config.filter?.start ?? 1;
    const end = this._config.filter?.end ?? Infinity;
    const exclude = this._config.filter?.exclude?.map(v => v.toString());

    const downloaded = await this._getDownloadedEp();

    return eps.find(ep => ep >= start && ep <= end && !exclude?.includes(ep.toString()) && !downloaded?.includes(ep.toString()));
  }

  getFilename(ep) {
    return `${this._filename}${ep}`;
  }

  getAbsolutePath(filename) {
    return path.join(this._root, filename);
  }
}

export default Base;
