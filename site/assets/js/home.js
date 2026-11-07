/* Home: live directory count from the data file */
(function () {
  if (!window.SIP_DIRECTORY) return;
  document.querySelectorAll('[data-dir-count]').forEach(function (el) { el.textContent = window.SIP_DIRECTORY.entries.length; });
})();
