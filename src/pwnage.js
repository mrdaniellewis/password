import { hexSha1 } from './sha1';

export default async (value) => {
  const hash = hexSha1(value).toUpperCase();
  const url = `https://api.pwnedpasswords.com/range/${hash.slice(0, 5)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw response;
  }
  const data = await response.text();
  let hits = 0;
  data.split('\n').some((line) => {
    const parts = line.trim().split(':');
    if (parts[0] === hash.slice(5)) {
      hits = +parts[1];
      return true;
    }
    return false;
  });
  return hits;
};
