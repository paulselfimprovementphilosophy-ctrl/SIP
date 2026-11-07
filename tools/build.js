#!/usr/bin/env node
/*
  S.I.P. site builder. No dependencies.
  Source:  src/pages (any depth, .html; each starts with a <!--page ... --> line)
           src/partials (layout.html, header.html, footer.html)
           src/assets (any depth; copied as-is)
  Output:  site/                  (this folder is what gets deployed)

  Page header line:
    <!--page title="..." desc="..." nav="home" robots="index,follow" scripts="directory-data.js,directory.js" -->
  Tokens in pages and partials:  {{root}}  (relative path back to site root)

  Run:  node tools/build.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'site');

const read = (p) => fs.readFileSync(p, 'utf8');
const layout = read(path.join(SRC, 'partials', 'layout.html'));
const header = read(path.join(SRC, 'partials', 'header.html'));
const footer = read(path.join(SRC, 'partials', 'footer.html'));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

function attrs(line) {
  const out = {};
  line.replace(/(\w+)="([^"]*)"/g, (_, k, v) => { out[k] = v; return ''; });
  return out;
}

// clean output
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// assets
for (const f of walk(path.join(SRC, 'assets'))) {
  const rel = path.relative(SRC, f);
  fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
  fs.copyFileSync(f, path.join(OUT, rel));
}

// pages
let count = 0;
for (const f of walk(path.join(SRC, 'pages'))) {
  const rel = path.relative(path.join(SRC, 'pages'), f);
  const depth = rel.split(path.sep).length - 1;
  const rootPath = depth === 0 ? '' : '../'.repeat(depth);
  let body = read(f);
  const m = body.match(/^<!--page([\s\S]*?)-->\s*/);
  if (!m) throw new Error('Missing <!--page ...--> header in ' + rel);
  const a = attrs(m[1]);
  body = body.slice(m[0].length);
  const scripts = (a.scripts || '').split(',').filter(Boolean)
    .map((s) => `<script src="{{root}}assets/js/${s.trim()}" defer></script>`).join('\n');
  let html = layout
    .replace('{{header}}', header)
    .replace('{{footer}}', footer)
    .replace('{{content}}', body)
    .replace('{{scripts}}', scripts)
    .replace(/{{title}}/g, a.title || 'S.I.P.')
    .replace(/{{desc}}/g, a.desc || '')
    .replace(/{{robots}}/g, a.robots || 'index,follow')
    .replace(/{{nav}}/g, a.nav || '')
    .replace(/{{root}}/g, rootPath);
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  count++;
}

// robots.txt: keep the workroom out of search
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /workroom/\n');

console.log(`Built ${count} pages into ${OUT}`);
