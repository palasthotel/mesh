(function(window) {

  function escapeHtml(text) {
    return
      text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
  }

  window.mesh.escapeHTML = escapeHTML;

})(this);
