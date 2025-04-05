import { saveJson } from './save.js';

export function renderNamesEditor(data, filename) {
  const container = document.getElementById("editor-container");
  container.innerHTML = `<h4>Editing: <code>${filename}</code></h4>`;

  let html = "";

  Object.keys(data).forEach(section => {
    html += `
      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <strong>${section}</strong>
          <button class="btn btn-sm btn-primary" onclick="addNameEntry('${section}')">Add Entry</button>
        </div>
        <ul class="list-group sortable" data-section="${section}">
          ${data[section].map((item, index) => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <input type="text" class="form-control form-control-sm mr-2 flex-grow-1" value="${item}">
              <button class="btn btn-sm btn-danger" onclick="removeNameEntry('${section}', ${index})">✕</button>
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  });

  html += `<button class="btn btn-success" id="save-names-btn">Save All</button>`;
  container.innerHTML += html;

  // Enable drag-and-drop using jQuery UI Sortable
  $(".sortable").sortable({ placeholder: "ui-state-highlight" }).disableSelection();

  // Attach global helper functions
  window.addNameEntry = function(section) {
    const ul = document.querySelector(`ul[data-section="${section}"]`);
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <input type="text" class="form-control form-control-sm mr-2 flex-grow-1" value="">
      <button class="btn btn-sm btn-danger">✕</button>
    `;
    li.querySelector("button").addEventListener("click", () => li.remove());
    ul.appendChild(li);
  };

  window.removeNameEntry = function(section, index) {
    const ul = document.querySelector(`ul[data-section="${section}"]`);
    ul.removeChild(ul.children[index]);
  };

  document.getElementById("save-names-btn").addEventListener("click", () => {
    const updatedData = {};

    document.querySelectorAll(".sortable").forEach(ul => {
      const section = ul.dataset.section;
      updatedData[section] = Array.from(ul.querySelectorAll("input")).map(input => input.value.trim()).filter(Boolean);
    });

    saveJson(filename, updatedData);
  });
}
