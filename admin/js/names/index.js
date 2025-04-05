// index.js
import { renderNamesEditor } from './render.js';
import { loadJSON } from '../loader.js'; // adjust path if needed

// Example: load default file on page load
const defaultFile = 'names.json'; // or whatever filename you use
loadJSON(defaultFile).then(data => {
  renderNamesEditor(data, defaultFile);
});
