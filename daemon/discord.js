import fetch from 'node-fetch';

export async function discord(entry, next) {
  if (!process.env.HEHDON_DISCORD) {
    return Promise.resolve();
  }

  const body = {
    content: typeof next.number !== 'undefined'
      ? `${entry.name} episodes ${next.number} downloaded`
      : `a new episodes of ${entry.name} was downloaded`
  };

  return fetch(process.env.HEHDON_DISCORD, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })
    .then(r => { if (!r.ok) throw `{${r.status}} Faild to send Discord notification` });
}

export default discord;