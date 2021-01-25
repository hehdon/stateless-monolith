class Base {
  constructor(anime, config) {
    this.anime = anime;
    this.config = config;
  }

  getLink() {
    throw new Error('getLink not implemented');
  }
}

module.exports = Base;