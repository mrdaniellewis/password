import { defaultOptions } from './default_options';

export function initialState() {
  return {
    options: {
      masterKey: '',
      siteTag: '',
      ...defaultOptions,
    },
    hash: '',
    showDetails: false,
    sync: [],
    sites: new Map(),
  };
}
