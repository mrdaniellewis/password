export function stringify(data) {
  let count = 0;
  const keys = {};
  const compacted = JSON.stringify(data, (key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const replaced = {};
      Object.keys(value).forEach((k) => {
        if (!keys[k]) {
          keys[k] = `$${count}`;
          count += 1;
        }
        replaced[keys[k]] = value[k];
      });
      return replaced;
    }
    return value;
  });
  return JSON.stringify([
    Object.keys(keys),
    JSON.parse(compacted),
  ]);
}

export function parse(data) {
  const [keys, compacted] = JSON.parse(data);
  return JSON.parse(JSON.stringify(compacted), (key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const replaced = {};
      Object.keys(value).forEach((k) => {
        replaced[keys[parseInt(k.slice(1), 10)]] = value[k];
      });
      return replaced;
    }
    return value;
  });
}
