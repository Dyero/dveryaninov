/* Load header and footer on all pages. fetch() uses paths relative to the HTML document. */
document.addEventListener('DOMContentLoaded', function() {
  fetch('header.html')
    .then(function(r) { return r.text(); })
    .then(function(data) {
      document.body.insertAdjacentHTML('afterbegin', data);
      if (window.DvAuth) {
        DvAuth.updateHeaderUI();
        DvAuth.initAuthModal();
      }
      document.dispatchEvent(new CustomEvent('headerReady'));
    })
    .catch(function(e) { console.error('Header:', e); });

  fetch('footer.html')
    .then(function(r) { return r.text(); })
    .then(function(data) {
      var m = document.querySelector('main');
      (m ? m : document.body).insertAdjacentHTML(m ? 'afterend' : 'beforeend', data);
    })
    .catch(function(e) { console.error('Footer:', e); });
});
