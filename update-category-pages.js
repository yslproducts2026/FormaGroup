const fs = require('fs');
const path = require('path');
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

const CATEGORIES = [
  { key: 'diningChairs', label: 'Dining Chair', file: 'dining-chairs.html', title: 'Dining Chair Collection', detailDir: 'dining-chairs' },
  { key: 'barStools', label: 'Bar Stool', file: 'bar-stools.html', title: 'Bar Stool Collection', detailDir: 'bar-stools' },
  { key: 'relaxingChairs', label: 'Relaxing Chair', file: 'relaxing-chairs.html', title: 'Relaxing Chair Collection', detailDir: 'relaxing-chairs' },
  { key: 'sofas', label: 'Sofa', file: 'sofas.html', title: 'Sofa Collection', detailDir: 'sofas' },
  { key: 'recliners', label: 'Recliner', file: 'recliners.html', title: 'Recliner Collection', detailDir: 'recliners' }
];

function getNavLinks() {
  return CATEGORIES.map(c => `<a href="${c.file}">${c.label}</a>`).join('');
}

function getFooterLinks() {
  return CATEGORIES.map(c => `<a href="${c.file}">${c.label}</a>`).join('');
}

function generateCategoryPage(cat, products) {
  const cards = products.map(p => `
    <a href="${cat.detailDir}/${p.sku}.html" class="card-link">
      <div class="card" data-sku="${p.sku}">
        <img loading="lazy" src="${p.img}" alt="${p.name}">
        <div class="card-name">${p.name}</div>
        <div class="card-spec">${p.material}</div>
      </div>
    </a>
  `).join('');

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cat.title} - Forma Group</title>
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/detail.css"></head>
<body data-category="${cat.key}">
<nav><div class="nav-inner">
  <a href="index.html" class="nav-logo"><img src="logo.png" alt="Forma Group"><span>Forma Group</span></a>
  <div class="nav-links">${getNavLinks()}</div>
</div></nav>
<div class="page-header"><h1>${cat.title}</h1></div>
<div class="grid">${cards}</div>
<footer><div class="footer-grid">
  <div class="footer-col"><p style="font-weight:700;font-size:16px;margin-bottom:8px;">Forma<span style="color:var(--accent)">Group</span></p>
  <p>Design from Nordic &mdash; Premium furniture for modern living.</p></div>
  <div class="footer-col"><h4>Categories</h4>${getFooterLinks()}</div>
  <div class="footer-col"><h4>Contact</h4>
  <p style="color:#999;font-size:13px;">Email: info@formagroup.com</p>
  <p style="color:#999;font-size:13px;">Tel: +86-15868213949</p></div>
</div><div class="footer-bottom"><p><span>&copy; 2026 Forma Group. All rights reserved.</span></p></div></footer>
<script src="js/detail.js"></script></body></html>`;
}

CATEGORIES.forEach(cat => {
  const items = products[cat.key] || [];
  const html = generateCategoryPage(cat, items);
  fs.writeFileSync(path.join(__dirname, cat.file), html);
  console.log(`✓ ${cat.file} (${items.length} products)`);
});

console.log('\n✅ All category pages updated with detail page links');
