const localStorageKey = 'db329347-75fb-4d26-8f4e-6b887f2f08a9';
const upgradeKeys = {
  tag: 'siteTag',
  size: 'hashWordSize',
  requireSpecial: 'restrictSpecial',
  requireDigitsOnly: 'restrictDigits',
};

export default class {
  entries() {
    return this.load().entries();
  }

  keys() {
    return this.load().keys();
  }

  [Symbol.iterator]() {
    return this.load()[Symbol.iterator]();
  }

  set(name, value) {
    const data = this.load();
    data.set(name, {
      ...value,
      timestamp: Date.now(),
    });
    this.save(data);
  }

  has(name) {
    return this.load().has(name);
  }

  get(name) {
    return this.load().get(name);
  }

  delete(name) {
    const data = this.load();
    data.delete(name);
    this.save(data);
  }

  load() {
    try {
      let data = localStorage.getItem(localStorageKey);
      data = JSON.parse(data);
      if (data.props) {
        data = this.inflate(data);
      } else {
        this.upgrade(data);
        data = [...Object.entries(data)];
      }
      return new Map(data);
    } catch (e) {
      console.error('error loading data', e);
    }
    return new Map();
  }

  save(data) {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(this.compact([...data])));
    } catch (e) {
      console.error('error saving data', e);
    }
  }

  compact(data) {
    const props = [];
    const map = data.map(([name, ob]) => {
      const mapped = [];
      Object.entries(ob).forEach(([key, value]) => {
        let index = props.indexOf(key);
        if (index === -1) {
          index = props.push(key) - 1;
        }
        mapped[index] = value;
      });
      return [name, mapped];
    });
    return { props, map };
  }

  inflate({ props, map }) {
    return map.map(([name, array]) => {
      const mapped = {};
      array.forEach((value, index) => {
        if (value !== null) {
          mapped[props[index]] = value;
        }
      });
      return [name, mapped];
    });
  }

  upgrade(data) {
    Object.values(data).forEach((item) => {
      Object.entries(upgradeKeys).forEach(([key, newKey]) => {
        if (key in item) {
          item[newKey] = item[key];
          delete item[key];
        }
      });
    });
  }
}
