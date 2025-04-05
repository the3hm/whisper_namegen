// datatable.js

export function destroyExistingTables(data) {
    Object.keys(data).forEach(section => {
      const tableId = `#table-${section}`;
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
    });
  }
  
  export function initializeAllDataTables(data) {
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
  
            // Restore saved sort option
            const saved = localStorage.getItem(`sort-filter-${section}`);
            if (saved) {
              $(`select.sort-filter[data-section='${section}']`).val(saved).trigger('change');
            }
          }
        });
  
        $(`select.sort-filter[data-section='${section}']`).on('change', function () {
          const value = $(this).val();
          localStorage.setItem(`sort-filter-${section}`, value);
  
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
  
  export function getDataTableOptions() {
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
          }
        }
      ]      
    };
  }