// render.js
import { destroyExistingTables, initializeAllDataTables } from './datatable.js';
import { createTabNav, createTabContent } from './uiBuilder.js';
import { bindTableEvents, bindAddRowButtons, bindDoubleClickEditing } from './events.js';
import { saveJson } from '../save.js';               // ✅ use correct relative paths
import { loadJSON } from '../loader.js';             // ✅ don't import from render.js itself!


export function renderNamesEditor(data, filename) {
  const container = document.getElementById("editor-container");
  container.innerHTML = `<h4>Editing: <code>${filename}</code></h4>`;

  const tabNav = createTabNav(data);
  const tabContent = createTabContent(data);
  container.innerHTML += tabNav + tabContent;

  destroyExistingTables(data);
  initializeAllDataTables(data);
  bindTableEvents(container, data);
  bindDoubleClickEditing();
  bindAddRowButtons(container, data);
  appendSaveButton(container, data, filename);
}

function appendSaveButton(container, data, filename) {
  const saveBtn = document.createElement("button");
  saveBtn.className = "btn btn-success mt-3";
  saveBtn.textContent = "Save All";
  saveBtn.addEventListener("click", () => {
    const updatedData = {};
    Object.keys(data).forEach((section) => {
      const table = $(`#table-${section}`).DataTable();
      const spans = table.rows().nodes().to$().find('.editable-text');
      const sorted = Array.from(spans)
        .map((span) => ({
          value: span.textContent.trim(),
          timestamp: parseInt(span.dataset.lastEdited || Date.now(), 10)
        }))
        .filter(item => item.value)
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(item => item.value);
      updatedData[section] = sorted;
    });

    saveJson(filename, updatedData).then(success => {
      if (success) {
        import("../loader.js").then(({ loadJSON }) => {
          loadJSON(filename).then((freshData) => {
            renderNamesEditor(freshData, filename);
          });
        });
      }
    });
  });
  container.appendChild(saveBtn);
}