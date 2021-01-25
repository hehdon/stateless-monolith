const fs = require('fs');
const path = require('path');

class Anime {
  constructor(config) {
    this._config = config;

    this._config.storage.file = this._config.storage.file ?? path.parse(this._config.storage.dir).name;
  }

  get name() {
    return this._config.name;
  }

  provider() {
    return new this._config.$provider(this, this._config[this._config.$provider.slug]);
  }

  getDownloaded() {
    return fs.promises.readdir(this._config.storage.dir).catch(()=>[]);
  }

  async getDownloadedEp() {
    return (await this.getDownloaded())
      .map(v => path.parse(v).name)
      .map(v => v.replace(this._config.storage.file + '-', ''));
  }

  async getNextEp() {
    const start = this._config.filter?.start ?? 1;
    const end = this._config.filter?.end ?? Infinity;
    const exclude = this._config.filter?.exclude?.map(v => v.toString());
    const include = this._config.filter?.include?.map(v => v.toString()) ?? [];

    const downloaded = await this.getDownloadedEp();
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

  getFilename(ep) {
    return `${this._config.storage.file}-${ep}`;
  }

  getAbsolutePath(filename) {
    return path.join(this._config.storage.dir, filename);
  }
}

module.exports = Anime;