import hasher from './hasher';
import Store from './store';
import pwnage from './pwnage';

const defaultSettings = {
  requireDigit: true,
  requirePunctuation: false,
  requireMixedCase: true,
  restrictSpecial: false,
  restrictDigits: false,
  hashWordSize: '26',
  bangify: false,
};

function lowerFirst(name) {
  return `${name[0].toLowerCase()}${name.slice(1)}`;
}

function $(name) {
  return document.getElementById(name);
}

function runOnce() {
  let ran = false;

  return (fn) => {
    if (!ran) {
      ran = true;
      setTimeout(() => (ran = false), 0);
      fn();
    }
  };
}

export default class {
  constructor() {
    this.store = new Store();
    this.datalistFallback();
    this.bindPassword('masterKey');
    ['siteTag', 'hash', ...Object.keys(defaultSettings)].forEach(key => this.bindInput(key));
    this.bindListeners();
    this.setSettings();
    this.updateDatalist();
    this.setTimers();
  }

  get settings() {
    return Object.keys(defaultSettings).reduce((ob, name) => {
      ob[name] = this[name];
      return ob;
    }, {});
  }

  setSettings(settings = defaultSettings) {
    Object.entries(settings).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  hasCustomSettings() {
    return !Object
      .entries(defaultSettings)
      .every(([key, value]) => this[key] === value);
  }

  bindInput(id) {
    const input = $(id);
    const prop = input.type === 'checkbox' ? 'checked' : 'value';
    const runChangeOnce = runOnce();

    Object.defineProperty(this, id, {
      enumerable: true,
      get() {
        return input[prop];
      },
      set(value) {
        input[prop] = value;
        runChangeOnce(() => input.dispatchEvent(new Event('change')));
      },
    });
    input.addEventListener('change', (e) => {
      runChangeOnce(() => (this[id] = e.target[prop]));
    });
  }

  bindPassword(id) {
    const input = $(id);
    let password = '';
    const runChangeOnce = runOnce();

    Object.defineProperty(this, id, {
      enumerable: true,
      get() {
        return password;
      },
      set(value) {
        password = value;
        input.value = Array(value.length).fill('x').join('');
        runChangeOnce(() => input.dispatchEvent(new Event('change')));
      },
    });
    input.addEventListener('change', (e) => {
      runChangeOnce(() => (this[id] = e.target.value));
    });
  }

  bindListeners() {
    Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype))
      .forEach(([key, value]) => {
        if (typeof value.value !== 'function') {
          return;
        }
        const parts = key.match(/^on(.*)(Click|Input|Change|Blur|Focus|Submit|Keypress|Cut|Paste|Keydown)$/);
        if (!parts) {
          return;
        }
        $(lowerFirst(parts[1])).addEventListener(parts[2].toLowerCase(), (e) => {
          this[key](e);
        });
      });
  }

  onResetClick() {
    this.setSettings();
  }

  onHashWordSizeInput(e) {
    $('sizeOutput').value = e.target.value;
  }

  onHashWordSizeChange(e) {
    $('sizeOutput').value = e.target.value;
  }

  onRestrictSpecialChange(e) {
    $('requirePunctuation').disabled = e.target.checked;
  }

  onRestrictDigitsChange(e) {
    $('requireDigit').disabled = e.target.checked;
    $('requirePunctuation').disabled = e.target.checked;
    $('requireMixedCase').disabled = e.target.checked;
    $('restrictSpecial').disabled = e.target.checked;
  }

  onMasterKeyFocus() {
    this.masterKey = '';
    this.hash = '';
  }

  onMasterKeyChange() {
    this.hash = '';
  }

  onSiteTagChange(e) {
    this.hash = '';
    if (!this.store.has(this.siteTag)) {
      this.setSettings();
      $('details').open = false;
      return;
    }
    this.setSettings(this.store.get(e.target.value));
    $('delete').hidden = false;
    $('details').open = this.hasCustomSettings();
    if (this.masterKey) {
      this.generateHash();
    }
  }

  onDeleteClick() {
    this.store.delete(this.siteTag);
    this.updateDatalist();
    $('delete').hidden = true;
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.generateHash();
    this.store.set(
      this.siteTag,
      this.settings,
    );
    $('delete').hidden = false;
  }

  // iOS will not focus a readonly element, so simulate it
  onHashKeypress(e) {
    e.preventDefault();
  }

  onHashKeydown(e) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
    }
  }

  onHashCut(e) {
    e.preventDefault();
  }

  onHashPaste(e) {
    e.preventDefault();
  }

  onSavedSitesChange(e) {
    this.siteTag = e.target.value;
  }

  generateHash() {
    this.hash = hasher({
      ...this.settings,
      masterKey: this.masterKey,
      siteTag: this.siteTag,
    });
    $('hash').focus();
    $('hash').setSelectionRange(0, this.hash.length);
    this.updateDatalist();
  }

  async onHashChange(e) {
    const el = e.target;
    el.classList.remove('ok', 'danger', 'network');
    el.title = '';
    if (el.value.length === 0) {
      return;
    }

    try {
      const hits = await pwnage(el.value);
      if (hits > 0) {
        el.classList.add('danger');
        el.title = `Password compromised ${this.state.pwned} times`;
      } else {
        el.classList.add('ok');
      }
    } catch (error) {
      if (error instanceof Response) {
        console.error(error);
      } else {
        el.classList.add('network');
      }
    }
  }

  updateDatalist() {
    const savedSites = $('savedSites');
    savedSites.innerHTML = '<option />';
    [...this.store.keys()].forEach((key) => {
      const option = document.createElement('option');
      option.value = key;
      option.label = key;
      option.innerHTML = key;
      savedSites.appendChild(option);
    });
  }

  setTimers() {
    let lastViewed = Date.now();
    window.addEventListener('focus', () => {
      if (lastViewed + 4 * 60 * 60 * 1000 < Date.now()) {
        this.masterKey = '';
      }
      lastViewed = Date.now();
    });
  }

  datalistFallback() {
    if (!$('siteTag').list) {
      const list = $('savedSites');
      const select = document.createElement('select');
      select.id = 'savedSites';
      list.parentNode.insertBefore(select, list.nextSibling);
      list.remove();
      this.bindInput('savedSites');
    }
  }
}
