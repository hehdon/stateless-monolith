class Base {
  constructor(payload) {
    this.payload = payload;
  }

  download() {
    throw new Error('getLink not implemented');
  }

  clean() {}
}

module.exports = Base;