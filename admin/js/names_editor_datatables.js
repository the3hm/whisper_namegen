export function initializeDataTableForSection(section) {
    $(`#table-${section}`).DataTable({
      paging: true,
      searching: true,
      pageLength: 5,
      ordering: false,
      info: false,
      lengthChange: false,
      language: {
        search: "Filter:",
        emptyTable: "No entries found."
      }
    });
  }
  