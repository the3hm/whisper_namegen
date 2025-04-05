// events.js
import { confirmToast } from '../utils.js';

export function bindTableEvents(container, data) {
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

export function bindDoubleClickEditing() {
  $("table[id^='table-']").off("dblclick").on("dblclick", "span.editable-text", function () {
    if (!$(this).siblings("input").length) {
      transformToInput(this);
    }
  });
}

export function bindAddRowButtons(container, data) {
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

export function transformToInput(span) {
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