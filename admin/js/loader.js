// loader.js

const BASE_PATH = '../data/';
const cache = new Map();
const ENABLE_CACHE_BUSTING = true;

/**
 * Loads a JSON file from /data/ with caching.
 * Appends a timestamp to avoid caching if ENABLE_CACHE_BUSTING is true.
 */
export async function loadJSON(filename) {
  if (cache.has(filename) && !ENABLE_CACHE_BUSTING) {
    return cache.get(filename);
  }

  const url = `${BASE_PATH}${filename}${ENABLE_CACHE_BUSTING ? `?t=${Date.now()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${filename}`);
  }

  const json = await response.json();

  if (!ENABLE_CACHE_BUSTING) {
    cache.set(filename, json);
  }

  return json;
}

/**
 * Clears the internal JSON cache
 */
export function clearCache() {
  cache.clear();
}
