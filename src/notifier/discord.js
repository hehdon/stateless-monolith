const https = require('https');

function discord(anime, data) {
  if (!process.env.ANIMED_DISCORD) {
    return Promise.resolve();
  }

  const url = new URL(process.env.ANIMED_DISCORD);
  const d = JSON.stringify({
    content: typeof data.number !== 'undefined'
      ? `${anime.name} episodes ${data.number} downloaded`
      : `a new episodes of ${anime.name} was downloaded`
  });

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': d.length
      }
    }, res => res.statusCode >= 400 ? reject() : resolve());
    req.on('error', reject)
    req.write(d);
    req.end();
  });
}

module.exports = discord;