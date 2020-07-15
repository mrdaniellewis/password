import { stringify, parse } from '../compressed_json';

// const storageKey = 'db329347-75fb-4d26-8f4e-6b887f2f08a9';

function load(storageKey) {
  try {
    return parse(localStorage.getItem(storageKey));
  } catch (e) {
    // Nothing
  }
  return {};
}

function save(items, storageKey) {
  try {
    localStorage.setItem(storageKey, stringify(items));
  } catch (e) {
    // ignore
  }
}

export class LocalStore extends null {
  constructor(storageKey) {
    const self = Object.create(new.target.prototype);
    for (const [key, value] of Object.entries(load(storageKey))) {
      self[key] = value;
    }

    return new Proxy(self, {
      set: (target, key, value) => {
        const result = Reflect.set(target, key, value);
        save(self, storageKey);
        return result;
      },

      deleteProperty(target, key) {
        const result = Reflect.deleteProperty(target, key);
        save(self, storageKey);
        return result;
      },
    });
  }

  * [Symbol.iterator]() {
    for (const item of Object.entries(this)) {
      yield item;
    }
  }
}
