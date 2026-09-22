const fs = require('fs');
const path = require('path');
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const sofas = products.sofas || [];

const outputDir = path.join(__dirname, 'sofas');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}

function yesNo(val) {
  if (val === true || val === 'Yes' || val === 'yes' || val === 1) return 'Yes';
  if (val === false || val === 'No' || val === 'no' || val === 0) return 'No';
  return val ? 'Yes' : 'No';
}

function fmt(val, unit = '') {
  if (val === null || val === undefined || val === '') return '—';
  return `${val}${unit ? ' ' + unit : ''}`;
}

function generateSofaPage(p) {
  const sku = p.sku;
  const isElectric = p.electronic || p.electricityStandard?.includes('CE');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${escapeHtml(p.name)} - ${escapeHtml(p.material)} - Forma Group">
<title>${escapeHtml(p.name)} - Forma Group</title>
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../css/detail.css">
</head>
<body>
<nav class="nav">
<div class="nav-inner">
  <a href="../index.html" class="nav-logo"><img src="../logo.png" alt="Forma Group"><span>Forma Group</span></a>
  <div class="nav-links">
    <a href="../index.html">Home</a>
    <a href="../dining-chairs.html">Dining Chair</a>
    <a href="../bar-stools.html">Bar Stool</a>
    <a href="../relaxing-chairs.html">Relaxing Chair</a>
    <a href="../sofas.html" class="active">Sofa</a>
    <a href="../recliners.html">Recliner</a>
  </div>
</div>
</nav>

<main class="detail-page">
  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <a href="../index.html">Home</a> / <a href="../sofas.html">Sofas</a> / <span>${escapeHtml(p.name)}</span>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="detail-hero">
    <div class="container detail-hero-grid">
      <div class="detail-gallery">
        <div class="main-image">
          <img id="mainImg" src="../${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" loading="eager">
        </div>
        ${p.images && p.images.length > 1 ? `
        <div class="thumbnails" id="thumbnails">
          ${p.images.map((img, i) => `<img src="../${escapeHtml(img)}" alt="${escapeHtml(p.name)} ${i+1}" class="${i===0?'active':''}" onclick="changeMain(this, '${escapeHtml(img)}')">`).join('')}
        </div>
        ` : ''}
      </div>
      
      <div class="detail-info">
        <div class="detail-badges">
          ${p.status === 'new' ? '<span class="badge badge-new">New</span>' : ''}
          ${p.status === 'bestseller' ? '<span class="badge badge-hot">Bestseller</span>' : ''}
          ${isElectric ? '<span class="badge badge-electric">Electric</span>' : '<span class="badge badge-manual">Manual</span>'}
        </div>
        <h1 class="detail-title">${escapeHtml(p.name)}</h1>
        <div class="detail-sku">SKU: ${escapeHtml(p.sku)}</div>
        <div class="detail-meta">
          ${p.compliance ? `<span class="meta-item"><strong>Compliance:</strong> ${escapeHtml(p.compliance)}</span>` : ''}
          ${p.performanceStandard ? `<span class="meta-item"><strong>Performance:</strong> ${escapeHtml(p.performanceStandard)}</span>` : ''}
          ${p.electricityStandard ? `<span class="meta-item"><strong>Electrical:</strong> ${escapeHtml(p.electricityStandard)}</span>` : ''}
          ${p.chemicalStandard ? `<span class="meta-item"><strong>Chemical:</strong> ${escapeHtml(p.chemicalStandard)}</span>` : ''}
        </div>
        
        <div class="detail-description">
          <h3>Description</h3>
          <p>${escapeHtml(p.desc || 'Premium sofa from Forma Group. Contact us for detailed specifications.')}</p>
        </div>

        ${p.features ? `
        <div class="detail-features">
          <h3>Key Features</h3>
          <ul>
            ${p.features.split('\n').map(f => f.trim()).filter(f => f).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="detail-actions">
          <a href="mailto:info@formagroup.com?subject=Inquiry: ${encodeURIComponent(p.name)}&body=SKU: ${encodeURIComponent(p.sku)}%0D%0A%0D%0AI'm interested in this product. Please provide pricing and availability." class="btn btn-primary btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Inquire Now
          </a>
          <a href="../sofas.html" class="btn btn-secondary btn-lg">← Back to Sofas</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Specifications Tabs -->
  <section class="detail-specs">
    <div class="container">
      <div class="specs-tabs" role="tablist">
        <button class="spec-tab active" role="tab" data-tab="dimensions">Dimensions</button>
        <button class="spec-tab" role="tab" data-tab="weight-packing">Weight & Packing</button>
        <button class="spec-tab" role="tab" data-tab="covers-foam">Covers & Foam</button>
        <button class="spec-tab" role="tab" data-tab="frame">Frame Structure</button>
        <button class="spec-tab" role="tab" data-tab="functions">Functions</button>
        <button class="spec-tab" role="tab" data-tab="legs-arm">Legs & Arm</button>
        <button class="spec-tab" role="tab" data-tab="packing">Packing Info</button>
      </div>

      <!-- Dimensions -->
      <div class="spec-panel active" id="tab-dimensions" role="tabpanel">
        <h3>Dimensions</h3>
        <div class="spec-table-wrapper">
          <table class="spec-table">
            <thead>
              <tr><th colspan="6">Stand Dimensions</th></tr>
              <tr><th>Width [W]</th><th>Height [H]</th><th>Depth [D]</th><th>Seat Depth [SD]</th><th>Seat Height [SH]</th><th>Seat Width [SW]</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>${fmt(p.standWidth, 'cm')}</td>
                <td>${fmt(p.standHeight, 'cm')}</td>
                <td>${fmt(p.standDepth, 'cm')}</td>
                <td>${fmt(p.seatDepth, 'cm')}</td>
                <td>${fmt(p.seatHeight, 'cm')}</td>
                <td>${fmt(p.seatWidth, 'cm')}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ${p.openWidth || p.openHeight || p.openDepth ? `
        <div class="spec-table-wrapper">
          <table class="spec-table">
            <thead><tr><th colspan="3">Open Dimensions (Reclined)</th></tr>
            <tr><th>Width [W]</th><th>Height [H]</th><th>Depth [D]</th></tr></thead>
            <tbody><tr>
              <td>${fmt(p.openWidth, 'cm')}</td>
              <td>${fmt(p.openHeight, 'cm')}</td>
              <td>${fmt(p.openDepth, 'cm')}</td>
            </tr></tbody>
          </table>
        </div>
        ` : ''}
        ${p.loadability ? `
        <div class="spec-highlight">
          <strong>40'HC Loadability:</strong> ${escapeHtml(p.loadability)}
        </div>
        ` : ''}
      </div>

      <!-- Weight & Packing -->
      <div class="spec-panel" id="tab-weight-packing" role="tabpanel">
        <h3>Weight & Packing (Coli Details)</h3>
        <div class="spec-table-wrapper">
          <table class="spec-table">
            <thead>
              <tr><th>Coli</th><th>Net Weight (kg)</th><th>Gross Weight (kg)</th><th>L × W × H (cm)</th><th>Volume (m³)</th></tr>
            </thead>
            <tbody>
              ${p.coli1Long ? `<tr><td>Coli 1</td><td>${fmt(p.coli1NetWeight)}</td><td>${fmt(p.coli1GrossWeight)}</td><td>${fmt(p.coli1Long)} × ${fmt(p.coli1Width)} × ${fmt(p.coli1Height)}</td><td>${p.coli1Volume ? fmt(p.coli1Volume) : '—'}</td></tr>` : ''}
              ${p.coli2Long ? `<tr><td>Coli 2</td><td>${fmt(p.coli2NetWeight)}</td><td>${fmt(p.coli2GrossWeight)}</td><td>${fmt(p.coli2Long)} × ${fmt(p.coli2Width)} × ${fmt(p.coli2Height)}</td><td>${p.coli2Volume ? fmt(p.coli2Volume) : '—'}</td></tr>` : ''}
              ${p.coli3Long ? `<tr><td>Coli 3</td><td>${fmt(p.coli3NetWeight)}</td><td>${fmt(p.coli3GrossWeight)}</td><td>${fmt(p.coli3Long)} × ${fmt(p.coli3Width)} × ${fmt(p.coli3Height)}</td><td>${p.coli3Volume ? fmt(p.coli3Volume) : '—'}</td></tr>` : ''}
              ${p.coli4Long ? `<tr><td>Coli 4</td><td>${fmt(p.coli4NetWeight)}</td><td>${fmt(p.coli4GrossWeight)}</td><td>${fmt(p.coli4Long)} × ${fmt(p.coli4Width)} × ${fmt(p.coli4Height)}</td><td>${p.coli4Volume ? fmt(p.coli4Volume) : '—'}</td></tr>` : ''}
              ${!p.coli1Long ? `<tr><td colspan="5" class="text-center">Packing details not specified</td></tr>` : ''}
            </tbody>
          </table>
        </div>
        ${p.hsCode ? `<p><strong>HS Code:</strong> ${escapeHtml(p.hsCode)}</p>` : ''}
      </div>

      <!-- Covers & Foam -->
      <div class="spec-panel" id="tab-covers-foam" role="tabpanel">
        <h3>Covers & Foam Specifications</h3>
        <div class="spec-grid">
          <div class="spec-card">
            <h4>Fabric / Leather</h4>
            <p>${escapeHtml(p.fabricLeather || p.color || 'Forma Fabric Collection')}</p>
          </div>
          <div class="spec-card">
            <h4>Seat Foam</h4>
            <p>${escapeHtml(p.seatFoam || '—')}</p>
          </div>
          <div class="spec-card">
            <h4>Back Foam</h4>
            <p>${escapeHtml(p.backFoam || '—')}</p>
          </div>
          <div class="spec-card">
            <h4>Arm Foam</h4>
            <p>${escapeHtml(p.armFoam || '—')}</p>
          </div>
          <div class="spec-card">
            <h4>Headrest Foam</h4>
            <p>${escapeHtml(p.headrestFoam || '—')}</p>
          </div>
        </div>
        <div class="spec-subsection">
          <h4>Seat Construction</h4>
          <div class="spec-grid">
            <div class="spec-card"><strong>Flat Spring:</strong> ${yesNo(p.flatSpring)}</div>
            <div class="spec-card"><strong>Topline Spring:</strong> ${yesNo(p.toplineSpring)}</div>
            <div class="spec-card"><strong>Webbing:</strong> ${yesNo(p.webbing)}</div>
          </div>
        </div>
      </div>

      <!-- Frame Structure -->
      <div class="spec-panel" id="tab-frame" role="tabpanel">
        <h3>Frame Construction Materials</h3>
        <div class="spec-grid">
          <div class="spec-card ${p.solidWood ? 'yes' : 'no'}"><strong>Solid Wood</strong><br>${yesNo(p.solidWood)}</div>
          <div class="spec-card ${p.chipboard ? 'yes' : 'no'}"><strong>Chipboard</strong><br>${yesNo(p.chipboard)}</div>
          <div class="spec-card ${p.fiberboard ? 'yes' : 'no'}"><strong>Fiberboard</strong><br>${yesNo(p.fiberboard)}</div>
          <div class="spec-card ${p.plywood ? 'yes' : 'no'}"><strong>Plywood</strong><br>${yesNo(p.plywood)}</div>
          <div class="spec-card ${p.cardboard ? 'yes' : 'no'}"><strong>Cardboard</strong><br>${yesNo(p.cardboard)}</div>
          <div class="spec-card ${p.steelFrame ? 'yes' : 'no'}"><strong>Steel Frame</strong><br>${yesNo(p.steelFrame)}</div>
        </div>
        <div class="spec-subsection">
          <h4>Arm Type</h4>
          <div class="spec-grid">
            <div class="spec-card"><strong>Separate (Screw):</strong> ${yesNo(p.separateFixed === 'Separate' || p.armSeparate)}</div>
            <div class="spec-card"><strong>Integrated (Fixed):</strong> ${yesNo(p.separateFixed === 'Fixed' || p.armFixed)}</div>
          </div>
        </div>
      </div>

      <!-- Functions -->
      <div class="spec-panel" id="tab-functions" role="tabpanel">
        <h3>Available Functions</h3>
        <div class="spec-grid functions-grid">
          <div class="spec-card ${p.manualHeadrestHeight ? 'yes' : 'no'}"><strong>Manual Headrest Height Adj.</strong><br>${yesNo(p.manualHeadrestHeight)}</div>
          <div class="spec-card ${p.manualHeadrestAngle ? 'yes' : 'no'}"><strong>Manual Headrest Angle Adj.</strong><br>${yesNo(p.manualHeadrestAngle)}</div>
          <div class="spec-card ${p.footrestSeatBackAdj ? 'yes' : 'no'}"><strong>Footrest/Seat/Back Adj.</strong><br>${yesNo(p.footrestSeatBackAdj)}</div>
          <div class="spec-card ${p.electronic ? 'yes' : 'no'}"><strong>Electronic Control</strong><br>${yesNo(p.electronic)}</div>
          <div class="spec-card ${p.manualControl ? 'yes' : 'no'}"><strong>Manual Control</strong><br>${yesNo(p.manualControl)}</div>
          <div class="spec-card ${p.heater ? 'yes' : 'no'}"><strong>Heater</strong><br>${yesNo(p.heater)}</div>
          <div class="spec-card ${p.massage ? 'yes' : 'no'}"><strong>Massage</strong><br>${yesNo(p.massage)}</div>
          <div class="spec-card ${p.usbCPort ? 'yes' : 'no'}"><strong>USB-C Port</strong><br>${yesNo(p.usbCPort)}</div>
          <div class="spec-card ${p.battery ? 'yes' : 'no'}"><strong>Battery</strong><br>${yesNo(p.battery)}</div>
          <div class="spec-card ${p.charger ? 'yes' : 'no'}"><strong>Charger</strong><br>${yesNo(p.charger)}</div>
          <div class="spec-card ${p.liftUp ? 'yes' : 'no'}"><strong>Lift-Up</strong><br>${yesNo(p.liftUp)}</div>
        </div>
        <div class="spec-subsection">
          <h4>Function Control</h4>
          <div class="spec-grid">
            <div class="spec-card"><strong>Manual:</strong> ${yesNo(p.controlManual ?? p.manualControl)}</div>
            <div class="spec-card"><strong>Electric:</strong> ${yesNo(p.controlElectric ?? p.electronic)}</div>
          </div>
        </div>
      </div>

      <!-- Legs & Arm -->
      <div class="spec-panel" id="tab-legs-arm" role="tabpanel">
        <h3>Legs & Arm Details</h3>
        <div class="spec-grid">
          <div class="spec-card"><strong>Leg Type:</strong> ${escapeHtml(p.legType || '—')}</div>
          <div class="spec-card"><strong>Leg Material:</strong> ${escapeHtml(p.legMaterial || '—')}</div>
          <div class="spec-card"><strong>Leg Height:</strong> ${fmt(p.legHeight, 'mm')}</div>
        </div>
      </div>

      <!-- Packing Info -->
      <div class="spec-panel" id="tab-packing" role="tabpanel">
        <h3>Packing Information</h3>
        <div class="spec-grid">
          <div class="spec-card"><strong>Packing Type:</strong> ${escapeHtml(p.packingType || '—')}</div>
          <div class="spec-card"><strong>Box Count:</strong> ${escapeHtml(p.boxCount || '—')}</div>
          <div class="spec-card"><strong>CBM:</strong> ${fmt(p.packingCBM, 'm³')}</div>
          <div class="spec-card"><strong>40'HC Loading:</strong> ${fmt(p.loading40HC, 'pcs')}</div>
        </div>
        ${p.warranty ? `<p class="spec-note"><strong>Warranty:</strong> ${escapeHtml(p.warranty)}</p>` : ''}
        ${p.supplier ? `<p class="spec-note"><strong>Supplier:</strong> ${escapeHtml(p.supplier)}</p>` : ''}
      </div>
    </div>
  </section>

  <!-- Related Products -->
  <section class="related-products">
    <div class="container">
      <h2>Related Products</h2>
      <div class="related-grid" id="relatedGrid"></div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container footer-grid">
    <div class="footer-col"><p class="footer-logo">Forma<span>Group</span></p><p>Design from Nordic — Premium furniture for modern living.</p></div>
    <div class="footer-col"><h4>Categories</h4><a href="../dining-chairs.html">Dining Chair</a><a href="../bar-stools.html">Bar Stool</a><a href="../relaxing-chairs.html">Relaxing Chair</a><a href="../sofas.html">Sofa</a><a href="../recliners.html">Recliner</a></div>
    <div class="footer-col"><h4>Contact</h4><p>Email: info@formagroup.com</p><p>Tel: +86-15868213949</p></div>
  </div>
  <div class="footer-bottom"><p>© 2026 Forma Group. All rights reserved.</p></div>
</footer>

<script src="../js/detail.js"></script>
<script>
  // Load related products
  fetch('../products.json').then(r => r.json()).then(data => {
    const allSofas = data.sofas || [];
    const related = allSofas.filter(s => s.sku !== '${p.sku}').slice(0, 4);
    const grid = document.getElementById('relatedGrid');
    grid.innerHTML = related.map(s => \`
      <a href="\${s.sku}.html" class="related-card">
        <img src="../\${s.img}" alt="\${s.name}" loading="lazy">
        <div class="related-name">\${s.name}</div>
        <div class="related-spec">\${s.material}</div>
      </a>
    \`).join('');
  });
</script>
</body>
</html>`;
}

// Generate all sofa detail pages
sofas.forEach(p => {
  const html = generateSofaPage(p);
  fs.writeFileSync(path.join(outputDir, `${p.sku}.html`), html);
  console.log(`✓ Generated: sofas/${p.sku}.html`);
});

console.log(`\n✅ Generated ${sofas.length} sofa detail pages in /sofas/`);
