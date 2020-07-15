export const GENERATE_HASH = Symbol('GENERATE_HASH');
export const RESET_OPTIONS = Symbol('SET_OPTIONS');
export const STORE_KEY = Symbol('STORE_KEY');
export const CLEAR_KEY = Symbol('CLEAR_KEY');
export const SET_OPTIONS = Symbol('SET_OPTIONS');
export const SET_SHOW_DETAILS = Symbol('SET_SHOW_DETAILS');
export const SAVE_SITES = Symbol('SAVE_SITES');
export const SAVE_SITE = Symbol('SAVE_SITE');
export const DELETE_SITE = Symbol('DELETE_SITE');
export const LOAD_SITE = Symbol('LOAD_SITE');

export function generateHash(e) {
  e.preventDefault();

  return {
    type: GENERATE_HASH,
  };
}

export function resetOptions() {
  return {
    type: RESET_OPTIONS,
  };
}

export function storeKey() {
  return {
    type: STORE_KEY,
  };
}

export function clearKey() {
  return {
    type: CLEAR_KEY,
  };
}

export function setOption(options) {
  return {
    type: SET_OPTIONS,
    ...options,
  };
}

export function setShowDetails(showDetails) {
  return {
    type: SET_SHOW_DETAILS,
    showDetails,
  };
}

export function deleteSite(siteTag) {
  return {
    type: DELETE_SITE,
    siteTag,
  };
}

export function saveSite(options) {
  return {
    type: SAVE_SITE,
    ...options,
  };
}

export function saveSites(sites) {
  return {
    type: SAVE_SITES,
    sites,
  };
}

export function loadSite(siteTag) {
  return {
    type: LOAD_SITE,
    siteTag,
  };
}
