// uiBuilder.js

export function createTabNav(data) {
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
  
  export function createTabContent(data) {
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