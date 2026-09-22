const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Deduplicate sofas by SKU
const seen = new Set();
const unique = [];
for (const p of products.sofas) {
  if (!seen.has(p.sku)) {
    seen.add(p.sku);
    unique.push(p);
  } else {
    console.log(`Removed duplicate: ${p.sku}`);
  }
}
products.sofas = unique;

fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
console.log(`\n✅ Deduplicated. Total sofas: ${products.sofas.length}`);
