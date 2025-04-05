export function saveJson(filename, content) {
    const url = `../admin/php/save.php`;
  
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.showToast(`Saved <code>${filename}</code> successfully!`, 'success');
          return true;
        } else {
          window.showToast('Error: ' + (data.error || 'Unknown error.'), 'error');
          return false;
        }
      })
      .catch(() => {
        window.showToast('Failed to save file.', 'error');
        return false;
      });
  }
  