import { renderTabbedEditor } from './tabs.js';
import { renderNamesEditor } from './names/render.js';
import { loadJSON } from './loader.js';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('load-keywords').addEventListener('click', () => {
    renderEditor('keywords', 'keywords_list.json');
  });

  document.getElementById('load-tags').addEventListener('click', () => {
    renderEditor('tags', 'tags.json');
  });

  document.getElementById('load-templates').addEventListener('click', () => {
    renderEditor('templates', 'templates/whisperborn_initiate.json');
  });

  document.getElementById('load-shellname').addEventListener('click', () => {
    renderTabbedEditor('shellname', 'shellname.json', {
      prefixes: { label: "Prefixes", columns: ["Prefix"] },
      cores: { label: "Cores", columns: ["Core"] },
      suffixes: { label: "Suffixes", columns: ["Suffix"] }
    });
  });

  document.getElementById('load-names').addEventListener('click', () => {
    loadJSON('names.json').then(data => {
      renderNamesEditor(data, 'names.json');
    });
  });

  document.getElementById('load-titles').addEventListener('click', () => {
    renderTabbedEditor('titles', 'titles.json', {
      titleIntro: { label: "Intro Phrases", columns: ["Intro"] },
      titleAdjectives: { label: "Adjectives", columns: ["Adjective"] },
      titleNouns: { label: "Nouns", columns: ["Noun"] }
    });
  });
});
