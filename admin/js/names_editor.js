// names_editor.js (modular version - updated filter layout and Dracula styling)

import { saveJson } from "./save.js";
import { confirmToast } from "./utils.js";

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

function createTabNav(data) {
  let nav = `<ul class="nav nav-tabs mb-3" id="namesTab" role="tablist">`;
  let first = true;
  for (const section of Object.keys(data)) {
    const tabId = `tab-${section}`;
    nav += `
      <li class="nav-item">
        <a class="nav-link ${first ? "active" : ""}" id="${tabId}-tab" data-toggle="tab" href="#${tabId}" role="tab">
          ${section}
        </a>
      </li>
    `;
    first = false;
  }
  return nav + `</ul>`;
}

function createTabContent(data) {
  let content = `<div class="tab-content" id="namesTabContent">`;
  let first = true;
  for (const [section, values] of Object.entries(data)) {
    const tabId = `tab-${section}`;
    const rows = values.map((value, index) => `
      <tr data-section="${section}" data-index="${index}">
        <td><span class="editable-text" data-last-edited="${Date.now()}">${value}</span></td>
        <td class="d-flex justify-content-between">
          <button class="btn btn-sm btn-primary edit-entry" title="Edit"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn btn-sm btn-danger delete-row" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`).join("");

    content += `
      <div class="tab-pane fade ${first ? "show active" : ""}" id="${tabId}" role="tabpanel">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <strong>${section}</strong>
            <button class="btn btn-sm btn-outline-primary" data-section="${section}" data-action="add-row">
              <i class="fas fa-plus"></i> Add Row
            </button>
          </div>
          <div class="card-body">
            <select class="form-control form-control-sm sort-filter mb-2" data-section="${section}">
              <option value="timestamp-desc">Recently Updated</option>
              <option value="alpha-asc">Alphabetical</option>
            </select>
            <table class="table table-bordered table-hover compact" id="table-${section}">
              <thead><tr><th>Value</th><th style="width: 50px;">Action</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    first = false;
  }
  return content + `</div>`;
}

function destroyExistingTables(data) {
  Object.keys(data).forEach(section => {
    const tableId = `#table-${section}`;
    if ($.fn.DataTable.isDataTable(tableId)) {
      $(tableId).DataTable().destroy();
    }
  });
}

function initializeAllDataTables(data) {
  Object.keys(data).forEach((section) => {
    const tableId = `#table-${section}`;
    if (!$.fn.DataTable.isDataTable(tableId)) {
      const dt = $(tableId).DataTable({
        ...getDataTableOptions(),
        initComplete: function () {
          const filter = $(`select.sort-filter[data-section='${section}']`).addClass("ml-2");
          const searchBox = $(`${tableId}_filter`);
          const wrapper = $('<div class="d-flex flex-row-reverse align-items-center gap-2 ml-2"></div>');
          wrapper.append(filter.detach());
          searchBox.addClass("d-flex flex-row-reverse align-items-center gap-2").append(wrapper);
        }
      });

      $(`select.sort-filter[data-section='${section}']`).on('change', function () {
        const value = $(this).val();
        const rows = dt.rows().nodes().toArray();

        const sorted = rows.sort((a, b) => {
          const aSpan = $(a).find(".editable-text")[0];
          const bSpan = $(b).find(".editable-text")[0];
          if (!aSpan || !bSpan) return 0;

          const aText = aSpan.textContent.trim().toLowerCase();
          const bText = bSpan.textContent.trim().toLowerCase();

          const aTime = parseInt(aSpan.dataset.lastEdited || 0, 10);
          const bTime = parseInt(bSpan.dataset.lastEdited || 0, 10);

          if (value === 'alpha-asc') return aText.localeCompare(bText);
          if (value === 'timestamp-desc') return bTime - aTime;

          return 0;
        });

        dt.clear();
        sorted.forEach(row => dt.row.add(row));
        dt.draw(false);
      });
    }
  });
}

function getDataTableOptions() {
  return {
    paging: true,
    pageLength: 10,
    searching: true,
    ordering: false,
    autoWidth: false,
    rowReorder: true,
    responsive: true,
    language: {
      searchPlaceholder: "Search...",
      search: "",
    },
    columnDefs: [
      {
        targets: 0,
        searchable: true,
        createdCell: (td, cellData) => {
          if (!td.querySelector('.editable-text')) {
            td.innerHTML = `<span class="editable-text" data-last-edited="${Date.now()}">${cellData}</span>`;
          }
        },
        render: (data, type) => (type === 'filter' || type === 'sort' ? data : data)
      }
    ]
  };
}

function bindTableEvents(container, data) {
  container.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-row");
    const editBtn = e.target.closest(".edit-entry");

    if (deleteBtn) {
      const row = deleteBtn.closest("tr");
      const section = row.dataset.section;
      const value = row.querySelector(".editable-text")?.textContent.trim();
      const table = $(`#table-${section}`).DataTable();

      confirmToast(`Are you sure you want to delete: "<b>${value}</b>"?`, () => {
        table.row(row).remove().draw(false);
      });
    }

    if (editBtn) {
      const span = editBtn.closest("tr").querySelector(".editable-text");
      if (span) transformToInput(span);
    }
  });
}

function bindDoubleClickEditing() {
  $("table[id^='table-']").off("dblclick").on("dblclick", "span.editable-text", function () {
    if (!$(this).siblings("input").length) {
      transformToInput(this);
    }
  });
}

function bindAddRowButtons(container, data) {
  container.querySelectorAll('[data-action="add-row"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;
      const table = $(`#table-${section}`).DataTable();
      const newRow = [
        `<span class="editable-text" data-last-edited="${Date.now()}">New Entry</span>`,
        `<div class="d-flex justify-content-between">
          <button class="btn btn-sm btn-primary edit-entry" title="Edit"><i class="fas fa-pencil-alt"></i></button>
          <button class="btn btn-sm btn-danger delete-row" title="Delete"><i class="fas fa-trash"></i></button>
        </div>`
      ];
      table.row.add(newRow).draw(false);
      table.page('last').draw('page');
    });
  });
}

function transformToInput(span) {
  const oldValue = span.textContent.trim();
  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control form-control-sm inline-input";
  input.value = oldValue;
  input.dataset.lastEdited = Date.now();
  span.replaceWith(input);
  input.focus();
  input.select();
  input.addEventListener("blur", () => {
    const newValue = input.value.trim();
    const newSpan = document.createElement("span");
    newSpan.className = "editable-text";
    newSpan.textContent = newValue || oldValue;
    newSpan.dataset.lastEdited = Date.now();
    input.replaceWith(newSpan);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
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
        import("./loader.js").then(({ loadJSON }) => {
          loadJSON(filename).then((freshData) => {
            renderNamesEditor(freshData, filename);
          });
        });
      }
    });
  });
  container.appendChild(saveBtn);
}