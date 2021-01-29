class Base {
  constructor(anime, config) {
    this.anime = anime;
    this.config = config;
  }

  async getLink() {
    const next = await this.anime.getNextEp();

    if (typeof next === 'undefined') {
      return undefined;
    }

    return this.getLinkNext(next);
  }

  getLinkNext(next) {
    throw new Error('getLinkNext not implemented');
  }
}

module.exports = Base;