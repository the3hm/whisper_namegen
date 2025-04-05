export function renderTable(type, data) {
    let html = "";
  
    if (type === 'keywords') {
      html += `
      <table class="table table-bordered table-striped table-hover">
        <thead class="thead-dark"><tr><th>Title</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody id="json-list">`;
  
      data.forEach((item, index) => {
        html += `
          <tr>
            <td><input type="text" class="form-control" value="${item.title}" data-index="${index}" data-field="title"></td>
            <td><textarea class="form-control" rows="2" data-index="${index}" data-field="description">${item.description}</textarea></td>
            <td><button class="btn btn-sm btn-danger delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button></td>
          </tr>`;
      });
  
      html += `</tbody></table>`;
    } else if (type === 'tags') {
      html += `
      <table class="table table-bordered table-hover">
        <thead class="thead-dark"><tr><th>Tag</th><th>Actions</th></tr></thead>
        <tbody id="json-list">`;
  
      data.forEach((tag, index) => {
        html += `
          <tr>
            <td><input type="text" class="form-control" value="${tag}" data-index="${index}" data-field="tag"></td>
            <td><button class="btn btn-sm btn-danger delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button></td>
          </tr>`;
      });
  
      html += `</tbody></table>`;
    }
  
    html += `<button class="btn btn-primary" id="addNewBtn">Add New</button>
             <button class="btn btn-success ml-2" id="save-json">Save</button>`;
  
    return html;
  }
  
  // Optional toast system
  window.showToast = function (message, type = "info") {
    const color = {
      success: 'bg-success',
      error: 'bg-danger',
      info: 'bg-info'
    }[type] || 'bg-info';
  
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white ${color} border-0 position-fixed m-3`;
    toast.style.bottom = '0';
    toast.style.right = '0';
    toast.style.zIndex = '9999';
    toast.role = 'alert';
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="ml-2 mb-1 close text-white" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
  
    document.body.appendChild(toast);
    $(toast).toast({ delay: 3000 });
    $(toast).toast('show');
  
    setTimeout(() => toast.remove(), 3500);
  };

  export function confirmToast(message, onConfirm) {
    // Avoid stacking multiple confirmations
    if (document.querySelector('.toast.confirmation')) return;
  
    const toast = document.createElement('div');
    toast.className = 'toast fade show confirmation';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
  
    // Dracula + Material Design styles
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.zIndex = 1060;
    toast.style.minWidth = '300px';
    toast.style.maxWidth = '600px';
    toast.style.backgroundColor = '#44475a';
    toast.style.color = '#f8f8f2';
    toast.style.border = '1px solid #6272a4';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.4)';
  
    toast.innerHTML = `
      <div class="toast-header" style="background-color: #282a36; color: #f8f8f2; border-bottom: 1px solid #6272a4;">
        <strong class="mr-auto">🧨 Confirm Delete</strong>
        <button type="button" class="ml-2 mb-1 close text-white" aria-label="Close" style="background: none; border: none;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="toast-body text-light" style="padding: 1rem;">
        <div style="margin-bottom: 0.75rem;">${message}</div>
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-sm btn-danger confirm-btn" style="margin-right: 0.5rem;">Delete</button>
          <button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
        </div>
      </div>
    `;
  
    document.body.appendChild(toast);
  
    toast.querySelector('.confirm-btn').addEventListener('click', () => {
      toast.remove();
      onConfirm?.();
    });
  
    toast.querySelector('.cancel-btn').addEventListener('click', () => {
      toast.remove();
    });
  
    toast.querySelector('.close').addEventListener('click', () => {
      toast.remove();
    });
  }
  
  
  