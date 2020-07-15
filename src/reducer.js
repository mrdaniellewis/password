import { GENERATE_HASH, STORE_KEY, CLEAR_KEY, SET_OPTIONS, SET_SHOW_DETAILS, RESET_OPTIONS, LOAD_SITE, DELETE_SITE, SAVE_SITE, SAVE_SITES } from './actions';
import hash from './hasher';
import { defaultOptions } from './default_options';
import { keyStore } from './key_store';

function optionsAreDefaults(options) {
  return Object.entries(defaultOptions).every(([key, value]) => (
    options?.[key] === value
  ));
}

export function reducer(state, { type, ...params }) {
  switch (type) {
    case GENERATE_HASH: {
      const { keyRef, options: { masterKey, ...saveOptions } } = state;
      return reducer(
        {
          ...state,
          hash: hash({ ...saveOptions, masterKey: keyStore.get(keyRef) }),
        },
        {
          type: SAVE_SITE,
          ...saveOptions,
        },
      );
    }
    case STORE_KEY: {
      const { options: { masterKey } } = state;
      const keyRef = {};
      keyStore.set(keyRef, masterKey);
      return {
        ...state,
        keyRef,
        options: { ...state.options, masterKey: Array(masterKey.length).fill('*').join('') },
      };
    }
    case CLEAR_KEY: {
      return {
        ...state,
        keyRef: null,
        options: { ...state.options, masterKey: '' },
      };
    }
    case SET_OPTIONS:
      return {
        ...state,
        options: { ...defaultOptions, ...state.options, ...params },
      };
    case SET_SHOW_DETAILS: {
      const { showDetails } = params;
      return {
        ...state,
        showDetails,
      };
    }
    case RESET_OPTIONS: {
      return {
        ...state,
        options: { ...state.options, ...defaultOptions },
      };
    }
    case LOAD_SITE: {
      const { siteTag } = params;
      const { options, sites } = state;
      const newOptions = sites.get(siteTag);
      return {
        ...state,
        options: { ...options, ...newOptions },
        showDetails: newOptions && !optionsAreDefaults(newOptions),
      };
    }
    case DELETE_SITE: {
      const { siteTag } = params;
      let { sites, sync } = state;
      if (sites.has(siteTag)) {
        sites = new Map(sites);
        sites.delete(siteTag);
      }
      sync = [...sync, { type: 'delete', key: siteTag, timestamp: Date.now() }];
      return {
        ...state,
        sites,
        sync,
      };
    }
    case SAVE_SITES: {
      const { sites } = params;
      return sites.reduce((s, site) => reducer(s, { type: SAVE_SITE, ...site }, state));
    }
    case SAVE_SITE: {
      const { siteTag, ...options } = params;
      let { sites, sync } = state;
      sites = new Map(sites);
      sites.set(siteTag, options);
      sync = [...sync, { type: 'add', key: siteTag, value: options, timestamp: Date.now() }];
      return {
        ...state,
        sites,
        sync,
      };
    }
    default:
      // ignore
  }

  return state;
}
