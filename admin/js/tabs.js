import { saveJson } from './save.js';

export function renderTabbedEditor(type, filename, sections) {
  fetch(`/data/${filename}`)
    .then(res => res.json())
    .then(data => {
      let html = `<h4>Editing: ${filename}</h4>`;
      html += `<ul class="nav nav-tabs" id="tabNav" role="tablist">`;

      const keys = Object.keys(sections);
      keys.forEach((key, idx) => {
        html += `<li class="nav-item">
          <a class="nav-link ${idx === 0 ? 'active' : ''}" id="${key}-tab" data-toggle="tab" href="#${key}" role="tab">${sections[key].label}</a>
        </li>`;
      });

      html += `</ul><div class="tab-content mt-3" id="tabContent">`;

      keys.forEach((key, idx) => {
        html += `<div class="tab-pane fade ${idx === 0 ? 'show active' : ''}" id="${key}" role="tabpanel">`;
        html += `<table class="table table-bordered table-hover table-sm">
          <thead><tr><th>${sections[key].columns[0]}</th><th>Actions</th></tr></thead>
          <tbody id="${key}-table">`;

        data[key].forEach((value, i) => {
          html += `<tr>
            <td><input class="form-control form-control-sm" value="${value}" data-index="${i}" data-section="${key}"></td>
            <td><button class="btn btn-sm btn-danger delete-btn" data-index="${i}" data-section="${key}"><i class="fas fa-trash"></i></button></td>
          </tr>`;
        });

        html += `</tbody></table>
          <button class="btn btn-sm btn-outline-primary" data-section="${key}" id="add-${key}">Add New</button>
        </div>`;
      });

      html += `</div><button class="btn btn-success mt-3" id="save-tabs">Save All</button>`;

      document.getElementById('editor-container').innerHTML = html;

      // Input handling
      document.querySelectorAll("input[data-section]").forEach(input => {
        input.addEventListener("input", e => {
          const { section, index } = e.target.dataset;
          data[section][index] = e.target.value;
        });
      });

      // Deletion
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", e => {
          const btnEl = e.target.closest("button");
          const section = btnEl.dataset.section;
          const index = btnEl.dataset.index;
          data[section].splice(index, 1);
          renderTabbedEditor(type, filename, sections);
        });
      });

      // Add new
      keys.forEach(key => {
        document.getElementById(`add-${key}`).addEventListener("click", () => {
          data[key].push("");
          renderTabbedEditor(type, filename, sections);
        });
      });

      // Save
      document.getElementById("save-tabs").addEventListener("click", () => {
        saveJson(filename, data);
      });
    });
}
