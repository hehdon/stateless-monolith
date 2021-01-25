const path = require('path');
const Anime = require('./anime');
const downloaders = require('./download');

const { move, numberFromEnv } = require('./helper');
const discord = require('./notifier/discord');

class Kernel {
  constructor(config) {
    this.config = config;
    this.animes = config.anime.map(a => new Anime(a));
    this.interval = numberFromEnv('ANIMED_INTERVAL', 3600) * 1000;
    this.maxChained = numberFromEnv('ANIMED_MAX_CHAINED', 10);
  }

  async update() {
    for (const anime of this.animes) {
      try {
        for (let status = true, count = 0; status && count < this.maxChained; count++) {
          status = await this.process(anime);
        }
      } catch(e) {
        console.error(e);
      }
    }
  }

  async process(anime) {
    const provider = anime.provider();

    const next = await provider.getLink();
    if (typeof next === 'undefined') {
      return false;
    }

    
    const Downloader = downloaders.find(v => next.type === v.slug);
    if (typeof Downloader === 'undefined') {
      throw new Error(`unknow downloader ${next.type}`);
    }
    
    let ret = true;
    const downloader = new Downloader(next.payload);
    try {
      const tmpFile = await downloader.download();
  
      const ext = path.parse(tmpFile).ext;
      await move(tmpFile, anime.getAbsolutePath(next.filename + ext));
      await discord(anime, next).catch(() => true);
    } catch(e) {
      ret = false;
      console.error(e);
    } finally {
      await downloader.clean();
      return ret;
    }
  }

  async cron() {
    await this.update();
    this.timeout = setTimeout(() => this.cron(), this.interval);
  }
}

module.exports = Kernel;