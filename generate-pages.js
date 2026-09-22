const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'products.json');

const CATEGORIES = [
  { key: 'diningChairs', label: 'Dining Chair', file: 'dining-chairs.html', title: 'Dining Chair Collection' },
  { key: 'barStools', label: 'Bar Stool', file: 'bar-stools.html', title: 'Bar Stool Collection' },
  { key: 'relaxingChairs', label: 'Relaxing Chair', file: 'relaxing-chairs.html', title: 'Relaxing Chair Collection' },
  { key: 'sofas', label: 'Sofa', file: 'sofas.html', title: 'Sofa Collection' },
  { key: 'recliners', label: 'Recliner', file: 'recliners.html', title: 'Recliner Collection' }
];

function loadProducts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function getNavLinks() {
  return CATEGORIES.map(c => `<a href="${c.file}">${c.label}</a>`).join('');
}

function getFooterLinks() {
  return CATEGORIES.map(c => `<a href="${c.file}">${c.label}</a>`).join('');
}

function generateCategoryPage(cat, products) {
  const cards = products.map(p => `
    <div class="card" data-sku="${p.sku}">
      <img loading="lazy" src="${p.img}" alt="${p.name}">
      <div class="card-name">${p.name}</div>
      <div class="card-spec">${p.material}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cat.title} - Forma Group</title>
<link rel="stylesheet" href="css/style.css"></head>
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
<script src="js/modal.js"></script></body></html>`;
}

function generateIndexPage(products) {
  const categoryCards = CATEGORIES.map(cat => {
    const items = products[cat.key] || [];
    const firstImg = items[0]?.img || 'images/products/FG310021.jpg';
    return `
    <div class="category-card">
      <a href="${cat.file}">
        <img src="${firstImg}" alt="${cat.label}">
        <h3>${cat.label}</h3>
      </a>
    </div>`;
  }).join('');

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Forma Group - Design from Nordic. Premium furniture manufacturer.">
<title>Forma Group - Design from Nordic</title>
<link rel="stylesheet" href="css/style.css"></head>
<body>
<nav><div class="nav-inner">
  <a href="index.html" class="nav-logo"><img src="logo.png" alt="Forma Group"><span>Forma Group</span></a>
  <div class="nav-links">${getNavLinks()}</div>
</div></nav>
<section class="hero"><div class="hero-content">
  <div class="hero-text"><h1>Forma<span>Group</span></h1>
  <p>Design from Nordic &mdash; Premium furniture for modern living</p></div>
</div></section>
<div class="trust-bar">
  <div class="trust-item"><span class="trust-num">20+</span><span class="trust-label">Years Experience</span></div>
  <div class="trust-item"><span class="trust-num">50+</span><span class="trust-label">Countries Exported</span></div>
  <div class="trust-item"><span class="trust-num">500+</span><span class="trust-label">Product Designs</span></div>
  <div class="trust-item"><span class="trust-num">24/7</span><span class="trust-label">Customer Service</span></div>
</div>
<section id="categories"><h2>Our Collections</h2>
<p class="section-sub">Discover our curated range of Nordic-inspired furniture</p>
<div class="category-cards">${categoryCards}</div></section>
<section class="about-section"><div class="about-content">
  <h2>About Forma Group</h2>
  <p>We are a furniture design company inspired by Nordic aesthetics &mdash; clean lines, functional beauty, and timeless craftsmanship.</p>
  <div class="about-features">
    <div class="af-item"><span class="af-icon">*</span><div><strong>Nordic Design</strong><p>Clean, minimal aesthetics inspired by Scandinavian tradition</p></div></div>
    <div class="af-item"><span class="af-icon">*</span><div><strong>Premium Materials</strong><p>Sustainably sourced wood and high-quality fabrics</p></div></div>
    <div class="af-item"><span class="af-icon">*</span><div><strong>Custom OEM/ODM</strong><p>Tailored designs for your market and brand</p></div></div>
    <div class="af-item"><span class="af-icon">*</span><div><strong>Global Shipping</strong><p>Reliable delivery to over 50 countries</p></div></div>
  </div></div></section>
<section id="contact"><h2>Get In Touch</h2>
<p class="section-sub">Ready to discover our collection? Contact us today.</p>
<div class="contact-cards">
  <div class="contact-card"><div class="contact-icon">@</div><h3>Email</h3><p><a href="mailto:info@formagroup.com">info@formagroup.com</a></p></div>
  <div class="contact-card"><div class="contact-icon">#</div><h3>Phone</h3><p><a href="tel:+8615868213949">+86-15868213949</a></p></div>
  <div class="contact-card"><div class="contact-icon">W</div><h3>WhatsApp</h3><p><a href="https://wa.me/8615868213949" target="_blank">Chat on WhatsApp</a></p></div>
</div></section>
<footer><div class="footer-grid">
  <div class="footer-col"><p style="font-weight:700;font-size:16px;margin-bottom:8px;">Forma<span style="color:var(--accent)">Group</span></p>
  <p>Design from Nordic &mdash; Premium furniture for modern living.</p></div>
  <div class="footer-col"><h4>Categories</h4>${getFooterLinks()}</div>
  <div class="footer-col"><h4>Contact</h4>
  <p style="color:#999;font-size:13px;">Email: info@formagroup.com</p>
  <p style="color:#999;font-size:13px;">Tel: +86-15868213949</p></div>
</div><div class="footer-bottom"><p><span>&copy; 2026 Forma Group. All rights reserved.</span></p></div></footer>
<script src="js/modal.js"></script></body></html>`;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
}

function generateModalJS(products) {
  const allProducts = {};
  for (const [cat, items] of Object.entries(products)) {
    allProducts[cat] = items.map(p => {
      // Ensure all fields exist with defaults
      const defaults = {
        price: '', currency: 'USD', moq: '', leadTime: '', packaging: '', hsCode: '',
        certifications: '', weight: '', volume: '', loadability: '', features: '',
        warranty: '', supplier: '', tags: [], status: 'active', images: [p.img],
        videoUrl: '', model3dUrl: '', notes: '',
        compliance: '', performanceStandard: '', electricityStandard: '', chemicalStandard: '',
        standWidth: '', standHeight: '', standDepth: '', openWidth: '', openHeight: '', openDepth: '',
        seatDepth: '', seatHeight: '', seatWidth: '',
        coli1Long: '', coli1Width: '', coli1Height: '', coli1NetWeight: '', coli1GrossWeight: '',
        coli2Long: '', coli2Width: '', coli2Height: '', coli2NetWeight: '', coli2GrossWeight: '',
        coli3Long: '', coli3Width: '', coli3Height: '', coli3NetWeight: '', coli3GrossWeight: '',
        coli4Long: '', coli4Width: '', coli4Height: '', coli4NetWeight: '', coli4GrossWeight: '',
        fabricLeather: '', seatFoam: '', backFoam: '', armFoam: '', headrestFoam: '',
        flatSpring: false, toplineSpring: false, webbing: false, solidWood: false,
        chipboard: false, fiberboard: false, plywood: false, cardboard: false, steelFrame: false,
        separateFixed: '', legType: '', legMaterial: '', legHeight: '',
        manualHeadrestHeight: false, manualHeadrestAngle: false, footrestSeatBackAdj: false,
        electronic: false, manualControl: false, heater: false, massage: false,
        usbCPort: false, battery: false, charger: false, liftUp: false,
        packingType: '', boxCount: ''
      };
      return { ...defaults, ...p };
    });
  }

  return `(function(){
var P=${JSON.stringify(allProducts, null, 2)};
var cat=document.body.dataset.category||"";
var ov=null,cb=null;
function ensureModal(){
  if(ov)return;
  ov=document.createElement("div");
  ov.id="yslModalOverlay";
  ov.className="modal-overlay";
  ov.innerHTML="<div class=\\"modal-dialog\\"><button class=\\"modal-close\\" id=\\"yslModalClose\\">&times;</button><div class=\\"modal-image-wrap\\"><div id=\\"yslModalImageSlider\\"></div></div><div class=\\"modal-body\\"><h2 id=\\"yslModalName\\"></h2><div class=\\"modal-sku\\" id=\\"yslModalSku\\"></div><div class=\\"modal-badges\\" id=\\"yslModalBadges\\"></div><div class=\\"modal-tabs\\" id=\\"yslModalTabs\\"></div><div class=\\"modal-tab-panels\\" id=\\"yslModalTabPanels\\"></div><a href=\\"mailto:info@formagroup.com?subject=Inquiry:%20\\"+encodeURIComponent(document.getElementById('yslModalName').textContent)+\"&body=SKU:%20\\"+encodeURIComponent(document.getElementById('yslModalSku').textContent.replace('SKU: ',''))+\"\\n\\nI'm interested in this product. Please provide more details.\\" class=\\"modal-cta\\">Inquire About This Product</a></div></div>";
  document.body.appendChild(ov);
  cb=document.getElementById("yslModalClose");
  ov.addEventListener('click', function(e){
    if(e.target.classList.contains('slider-prev')) changeSlide(-1);
    if(e.target.classList.contains('slider-next')) changeSlide(1);
    if(e.target.classList.contains('slider-dot')) changeSlide(parseInt(e.target.dataset.index));
    if(e.target.classList.contains('modal-tab-btn')) switchTab(e.target.dataset.tab);
  });
}
let currentSlide = 0;
let currentImages = [];
function changeSlide(dir){
  const slider = document.getElementById('yslModalImageSlider');
  if(!slider) return;
  if(typeof dir === 'number'){
    if(dir === -1 || dir === 1) currentSlide = (currentSlide + dir + currentImages.length) % currentImages.length;
    else currentSlide = dir;
  }
  renderSlider();
}
function renderSlider(){
  const slider = document.getElementById('yslModalImageSlider');
  if(!slider || !currentImages.length) return;
  slider.innerHTML = currentImages.map((img,i)=>
    '<img src="'+img+'" alt="'+(i+1)+'" style="display:'+(i===currentSlide?'block':'none')+';width:100%;height:100%;object-fit:contain">'
  ).join('') +
  (currentImages.length>1?
    '<button class="slider-prev" aria-label="Previous">&#8249;</button>'+
    '<button class="slider-next" aria-label="Next">&#8250;</button>'+
    '<div class="slider-dots">'+currentImages.map((_,i)=>'<span class="slider-dot '+(i===currentSlide?'active':'')+'" data-index="'+i+'"></span>').join('')+'</div>'
  :'');
}
function switchTab(tabName){
  document.querySelectorAll('#yslModalTabs .modal-tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('#yslModalTabPanels .modal-tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelector('#yslModalTabs .modal-tab-btn[data-tab="'+tabName+'"]')?.classList.add('active');
  document.getElementById('yslModalPanel-'+tabName)?.classList.add('active');
}
function openModal(p){
  ensureModal();
  currentImages = (p.images && p.images.length) ? p.images : [p.img];
  currentSlide = 0;
  renderSlider();
  document.getElementById("yslModalName").textContent=p.name;
  document.getElementById("yslModalSku").textContent="SKU: "+p.sku;
  // Badges
  var badges=[];
  if(p.status==='new') badges.push('<span class="badge badge-new">New</span>');
  if(p.status==='bestseller') badges.push('<span class="badge badge-hot">Bestseller</span>');
  if(p.status==='outofstock') badges.push('<span class="badge badge-oos">Out of Stock</span>');
  if(p.moq) badges.push('<span class="badge badge-moq">MOQ: '+esc(p.moq)+'</span>');
  if(p.leadTime) badges.push('<span class="badge badge-lead">Lead: '+esc(p.leadTime)+'</span>');
  document.getElementById("yslModalBadges").innerHTML=badges.join(' ');
  // Build tabs
  var tabs = [
    {id:'overview', label:'Overview', icon:'📋'},
    {id:'dimensions', label:'Dimensions', icon:'📐'},
    {id:'structure', label:'Structure', icon:'🏗️'},
    {id:'cover', label:'Cover & Foam', icon:'🛋️'},
    {id:'function', label:'Functions', icon:'⚙️'},
    {id:'packing', label:'Packing', icon:'📦'},
    {id:'trade', label:'Trade Info', icon:'💼'},
    {id:'media', label:'Media', icon:'📸'}
  ];
  var tabsHtml = tabs.map(t => '<button class="modal-tab-btn '+(t.id==='overview'?'active':'')+'" data-tab="'+t.id+'">'+t.icon+' '+t.label+'</button>').join('');
  document.getElementById('yslModalTabs').innerHTML = tabsHtml;
  // Build panels
  var panelsHtml = tabs.map(t => '<div class="modal-tab-panel '+(t.id==='overview'?'active':'')+'" id="yslModalPanel-'+t.id+'">'+renderPanel(t.id, p)+'</div>').join('');
  document.getElementById('yslModalTabPanels').innerHTML = panelsHtml;
  ov.classList.add("active");
  document.body.style.overflow="hidden";
}
function renderPanel(tab, p){
  switch(tab){
    case 'overview':
      return '<table><tbody>'+
        row('Material', p.material)+
        row('Color', p.color)+
        row('Dimensions', p.dimensions)+
        (p.weight ? row('Weight', p.weight) : '')+
        (p.volume ? row('Volume', p.volume) : '')+
        (p.loadability ? row('40HC Loadability', p.loadability) : '')+
        (p.packaging ? row('Packaging', p.packaging) : '')+
        (p.hsCode ? row('HS Code', p.hsCode) : '')+
        (p.certifications ? row('Certifications', p.certifications) : '')+
        (p.warranty ? row('Warranty', p.warranty) : '')+
        (p.supplier ? row('Supplier', p.supplier) : '')+
        (p.compliance ? row('Compliance', p.compliance) : '')+
        (p.performanceStandard ? row('Performance Std', p.performanceStandard) : '')+
        (p.electricityStandard ? row('Electrical Std', p.electricityStandard) : '')+
        (p.chemicalStandard ? row('Chemical Std', p.chemicalStandard) : '')+
        '</tbody></table>'+
        '<div class="modal-section"><h4>Description</h4><p class="modal-desc">'+esc(p.desc)+'</p></div>'+
        (p.features ? '<div class="modal-section"><h4>Key Features</h4><p>'+esc(p.features).replace(/\\n/g, '<br>')+'</p></div>' : '')+
        (p.notes ? '<div class="modal-section"><h4>Internal Notes</h4><p>'+esc(p.notes)+'</p></div>' : '');
    case 'dimensions':
      return '<table class="spec-table"><tbody>'+
        sectionRow('Standard Dimensions')+
        row('Width (W)', p.standWidth ? p.standWidth+' cm' : '-')+
        row('Height (H)', p.standHeight ? p.standHeight+' cm' : '-')+
        row('Depth (D)', p.standDepth ? p.standDepth+' cm' : '-')+
        sectionRow('Open Dimensions')+
        row('Width (W)', p.openWidth ? p.openWidth+' cm' : '-')+
        row('Height (H)', p.openHeight ? p.openHeight+' cm' : '-')+
        row('Depth (D)', p.openDepth ? p.openDepth+' cm' : '-')+
        sectionRow('Seat Dimensions')+
        row('Seat Depth (SD)', p.seatDepth ? p.seatDepth+' cm' : '-')+
        row('Seat Height (SH)', p.seatHeight ? p.seatHeight+' cm' : '-')+
        row('Seat Width (SW)', p.seatWidth ? p.seatWidth+' cm' : '-')+
        sectionRow('Container Loadability')+
        row('40HC Sets', p.loadability || '-')+
        '</tbody></table>';
    case 'structure':
      var struct = [];
      if(p.flatSpring) struct.push('Flat Spring');
      if(p.toplineSpring) struct.push('Topline Spring');
      if(p.webbing) struct.push('Webbing');
      if(p.solidWood) struct.push('Solid Wood');
      if(p.chipboard) struct.push('Chipboard');
      if(p.fiberboard) struct.push('Fiberboard');
      if(p.plywood) struct.push('Plywood');
      if(p.cardboard) struct.push('Cardboard');
      if(p.steelFrame) struct.push('Steel Frame');
      return '<table><tbody>'+
        row('Frame Type', p.separateFixed || '-')+
        row('Leg Type', p.legType || '-')+
        row('Leg Material', p.legMaterial || '-')+
        (p.legHeight ? row('Leg Height', p.legHeight+' mm') : '')+
        row('Internal Structure', struct.join(', ') || 'Not specified')+
        '</tbody></table>';
    case 'cover':
      return '<table><tbody>'+
        row('Fabric/Leather', p.fabricLeather || '-')+
        row('Seat Foam', p.seatFoam || '-')+
        row('Back Foam', p.backFoam || '-')+
        (p.armFoam ? row('Arm Foam', p.armFoam) : '')+
        (p.headrestFoam ? row('Headrest Foam', p.headrestFoam) : '')+
        '</tbody></table>';
    case 'function':
      var funcs = [];
      if(p.manualHeadrestHeight) funcs.push('Manual Headrest Height Adj.');
      if(p.manualHeadrestAngle) funcs.push('Manual Headrest Angle Adj.');
      if(p.footrestSeatBackAdj) funcs.push('Footrest/Seat/Back Adj.');
      if(p.electronic) funcs.push('Electronic Control');
      if(p.manualControl) funcs.push('Manual Control');
      if(p.heater) funcs.push('Heater');
      if(p.massage) funcs.push('Massage');
      if(p.usbCPort) funcs.push('USB-C Port');
      if(p.battery) funcs.push('Battery');
      if(p.charger) funcs.push('Charger');
      if(p.liftUp) funcs.push('Lift-Up');
      return '<table><tbody>'+
        (funcs.length ? row('Available Functions', funcs.join(', ')) : row('Available Functions', 'None'))+
        '</tbody></table>';
    case 'packing':
      var packRows = '';
      if(p.coli1Long) packRows += coliRows('Coli 1', p.coli1Long, p.coli1Width, p.coli1Height, p.coli1NetWeight, p.coli1GrossWeight);
      if(p.coli2Long) packRows += coliRows('Coli 2', p.coli2Long, p.coli2Width, p.coli2Height, p.coli2NetWeight, p.coli2GrossWeight);
      if(p.coli3Long) packRows += coliRows('Coli 3', p.coli3Long, p.coli3Width, p.coli3Height, p.coli3NetWeight, p.coli3GrossWeight);
      if(p.coli4Long) packRows += coliRows('Coli 4', p.coli4Long, p.coli4Width, p.coli4Height, p.coli4NetWeight, p.coli4GrossWeight);
      return '<table class="spec-table"><tbody>'+
        row('Packing Type', p.packingType || '-')+
        row('Box Count', p.boxCount || '-')+
        packRows+
        '</tbody></table>';
    case 'trade':
      return '<table class="trade-table"><tbody>'+
        (p.price ? row('Price', (p.currency||'USD')+' '+p.price) : '')+
        (p.moq ? row('MOQ', p.moq) : '')+
        (p.leadTime ? row('Lead Time', p.leadTime) : '')+
        (p.tags && p.tags.length ? row('Tags', p.tags.join(', ')) : '')+
        '</tbody></table>';
    case 'media':
      var mediaHtml = '';
      if(p.videoUrl) mediaHtml += '<a href="'+esc(p.videoUrl)+'" target="_blank" class="media-link">🎬 Product Video</a>';
      if(p.model3dUrl) mediaHtml += '<a href="'+esc(p.model3dUrl)+'" target="_blank" class="media-link">🔗 3D Model</a>';
      if(p.images && p.images.length>1) mediaHtml += '<span class="media-link">📸 '+p.images.length+' images in gallery</span>';
      return mediaHtml || '<p style="color:var(--gray)">No additional media</p>';
  }
  return '';
}
function row(label, value){
  if(value === '' || value === null || value === undefined) return '';
  return '<tr><td>'+esc(label)+'</td><td>'+esc(value)+'</td></tr>';
}
function sectionRow(label){
  return '<tr class="section-header"><td colspan="2"><strong>'+esc(label)+'</strong></td></tr>';
}
function coliRows(label, L, W, H, NW, GW){
  return sectionRow(label)+
    row('L × W × H', (L||'-')+' × '+(W||'-')+' × '+(H||'-')+' cm')+
    row('Net Weight', NW ? NW+' kg' : '-')+
    row('Gross Weight', GW ? GW+' kg' : '-');
}
function closeModal(){if(!ov)return;ov.classList.remove("active");document.body.style.overflow="";}
document.addEventListener("DOMContentLoaded",function(){
  ensureModal();
  if(cb)cb.addEventListener("click",closeModal);
  if(ov)ov.addEventListener("click",function(e){if(e.target===ov)closeModal();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeModal();});
  if(cat&&P[cat]){
    var cards=document.querySelectorAll(".card");
    var items=P[cat];
    for(var i=0;i<cards.length&&i<items.length;i++){
      (function(card,p){card.addEventListener("click",function(){openModal(p);});})(cards[i],items[i]);
    }
  }
});
})();`;
}

// Main
function main() {
  console.log('📦 Loading products...');
  const products = loadProducts();
  
  console.log('🏠 Generating index.html...');
  fs.writeFileSync(path.join(__dirname, 'index.html'), generateIndexPage(products));
  
  console.log('📄 Generating category pages...');
  for (const cat of CATEGORIES) {
    const items = products[cat.key] || [];
    const html = generateCategoryPage(cat, items);
    fs.writeFileSync(path.join(__dirname, cat.file), html);
    console.log(`  ✓ ${cat.file} (${items.length} products)`);
  }
  
  console.log('🔧 Generating modal.js...');
  fs.writeFileSync(path.join(__dirname, 'js', 'modal.js'), generateModalJS(products));
  
  console.log('\n✅ All pages generated successfully!');
  console.log('🚀 Run "git add . && git commit -m \"Update products\" && git push" to deploy');
}

main();
