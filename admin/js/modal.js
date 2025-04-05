export function showModal(type, callback) {
    const inputs = document.getElementById('modal-inputs');
    inputs.innerHTML = '';
  
    if (type === 'keywords') {
      inputs.innerHTML += '<input class="form-control mb-2" id="new-title" placeholder="Title">';
      inputs.innerHTML += '<textarea class="form-control" id="new-desc" placeholder="Description"></textarea>';
    } else if (type === 'tags') {
      inputs.innerHTML += '<input class="form-control" id="new-tag" placeholder="New Tag">';
    }
  
    $('#addModal').modal('show');
  
    document.getElementById('saveModalBtn').onclick = () => {
      let newItem;
      if (type === 'keywords') {
        newItem = {
          title: document.getElementById('new-title').value,
          description: document.getElementById('new-desc').value
        };
      } else if (type === 'tags') {
        newItem = document.getElementById('new-tag').value;
      }
  
      $('#addModal').modal('hide');
      callback(newItem);
    };
  }
  