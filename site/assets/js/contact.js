/* Contact page: fills in only what config.js provides. */
(function () {
  var c = window.SIP_CONTACT || {}, d = document;
  function row(label, html) { return '<div><dt>' + label + '</dt><dd>' + html + '</dd></div>'; }
  var out = '';
  if (c.email) out += row('Email', '<a href="mailto:' + c.email + '">' + c.email + '</a>');
  if (c.phone) out += row('Phone', '<a href="tel:' + c.phone.replace(/[^\d+]/g, '') + '">' + c.phone + '</a>');
  if (c.address && c.address.length) out += row('Address', c.address.join('<br>'));
  var el = d.getElementById('contact-spec'); if (el) el.innerHTML = out;
  var pending = d.getElementById('contact-pending'); if (pending) pending.hidden = !!(c.email || c.phone);
  d.querySelectorAll('[data-mailto]').forEach(function (a) {
    if (c.email) { a.href = 'mailto:' + c.email + '?subject=' + encodeURIComponent(a.getAttribute('data-mailto')); } else { a.hidden = true; }
  });
})();
