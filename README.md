# S.I.P. website

Static site for Self-Improvement Philosophy (no framework, no dependencies).

- `src/pages/`     page content (each starts with a `<!--page ... -->` line)
- `src/partials/`  shared layout, header, footer
- `src/assets/`    CSS, JS, favicon. Directory data: `assets/js/directory-data.js`. Contact details: `assets/js/config.js`
- `site/`          built output, the folder to deploy
- `tools/build.js` run `node tools/build.js` after any edit

Open `site/index.html` directly, or add `?static` to a URL to disable scroll animations.
`site/workroom/index.html` is internal (noindex, not linked). Do not publish the .docx drafts in this folder; deploy only `site/`.
