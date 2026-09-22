const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'products.json');
const FOLDER = '/home/hansen/Hjortknudsen/artical card/';

function parseInputForm(ws) {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  const data = {};
  
  // Headers are in row 3 (index 2), values in row 4 (index 3)
  for (let c = range.s.c; c <= range.e.c; c++) {
    const header = ws[XLSX.utils.encode_cell({r: 2, c})]?.v || '';
    const val = ws[XLSX.utils.encode_cell({r: 3, c})]?.v || '';
    if (header && val !== '' && val !== '/') {
      data[header.toString().trim()] = val.toString().trim();
    }
  }
  return data;
}

function parseBoolean(val) {
  if (!val) return false;
  const v = val.toString().trim().toLowerCase();
  return v === 'yes' || v === 'true' || v === '1' || v === 'y';
}

function parseNumber(val) {
  if (!val) return null;
  const v = val.toString().trim().replace(',', '.');
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function getModel(ws) {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let r = 0; r <= Math.min(10, range.e.r); r++) {
    const cellC = ws[XLSX.utils.encode_cell({r, c: 2})];
    if (cellC && cellC.v && cellC.v.toString().match(/^[A-Z]{2}\d+/)) {
      return cellC.v.toString().trim();
    }
  }
  return null;
}

const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const existingSkus = new Set();
for (const cat of Object.values(products)) {
  for (const p of cat) existingSkus.add(p.sku);
}

const files = fs.readdirSync(FOLDER).filter(f => f.endsWith('.xlsx'));

const newProducts = [];

for (const file of files) {
  const filePath = path.join(FOLDER, file);
  try {
    const wb = XLSX.readFile(filePath);
    
    // Find Input Form sheet
    const inputSheetName = wb.SheetNames.find(s => s.toLowerCase().includes('input'));
    if (!inputSheetName) continue;
    
    const ws = wb.Sheets[inputSheetName];
    const model = getModel(wb.Sheets[wb.SheetNames[0]]) || getModel(ws);
    const data = parseInputForm(ws);
    
    if (!model || existingSkus.has(model)) {
      console.log(`Skipping ${file}: ${model || 'no model'} (${existingSkus.has(model) ? 'exists' : ''})`);
      continue;
    }
    
    // Determine dimensions
    const width = parseNumber(data['Width          [W]']);
    const height = parseNumber(data['Height      [H]']);
    const depth = parseNumber(data['Depth         [D]']);
    const seatDepth = parseNumber(data['Seat depth [SD]']);
    const seatHeight = parseNumber(data['Seat height [SH] ']);
    const seatWidth = parseNumber(data['Seat Width [SW]']);
    const loadability = parseNumber(data[" 40'HC /Sets"]);
    
    // Packing
    const coli1Long = parseNumber(data['Long']);
    const coli1Width = parseNumber(data['Width']);
    const coli1Height = parseNumber(data['height']);
    const coli1NetWeight = parseNumber(data['Net Weight']);
    const coli1GrossWeight = parseNumber(data['Gross Weight']);
    
    // Structure
    const flatSpring = parseBoolean(data['Flat spring']);
    const toplineSpring = parseBoolean(data['Topline spring']);
    const webbing = parseBoolean(data['Webbing']);
    const solidWood = parseBoolean(data['solid wood']);
    const chipboard = parseBoolean(data['chipboard']);
    const fiberboard = parseBoolean(data['fiberboard']);
    const plywood = parseBoolean(data['plywood']);
    const cardboard = parseBoolean(data['cardboard']);
    const steelFrame = parseBoolean(data['steel frame']);
    
    // Function
    const separateFixed = data['Separate'] === 'Yes' && data['Fixed'] === 'No' ? 'Separate' : 
                          data['Fixed'] === 'Yes' ? 'Fixed' : (data['Separate'] || data['Fixed'] || '');
    const legType = data['type of measured legs'] || '';
    const legMaterial = data['material'] || '';
    const legHeight = parseNumber(data['measurements [mm]']);
    
    const manualHeadrestHeight = parseBoolean(data['Manual headrest  Height adj.']);
    const manualHeadrestAngle = parseBoolean(data['Manual headrest  angle adj.']);
    const footrestSeatBackAdj = parseBoolean(data['Footrest/Seat/Back adj']);
    const electronic = parseBoolean(data['Electronic']);
    const manualControl = parseBoolean(data['Manual']);
    const heater = parseBoolean(data['heater']);
    const massage = parseBoolean(data['Massage']);
    const usbCPort = parseBoolean(data['USB-C port']);
    const battery = parseBoolean(data['Battery']);
    const charger = parseBoolean(data['Charger']);
    const liftUp = parseBoolean(data['Lift-Up']);
    
    // Cover
    const fabricLeather = data['Fabric/Leather#'] || '';
    const seatFoam = data['seat'] || '';
    const backFoam = data['back'] || '';
    const armFoam = data['arm'] || '';
    const headrestFoam = data['headrest'] || '';
    
    // Packing
    const packingType = data['Carton/Soft Pack'] || '';
    const boxCount = data['1 or mutiple box'] || '';
    
    // Electric standard
    const electricityStandard = data['Electricity'] || '';
    const chemicalStandard = data['Chemical'] || '';
    const performanceStandard = data['Performance'] || '';
    
    // Build dimensions string
    let dimStr = '';
    if (width && height && depth) {
      dimStr = `${width} x ${height} x ${depth} cm`;
    }
    if (seatDepth && seatHeight && seatWidth) {
      dimStr += `, Seat: ${seatDepth} x ${seatWidth} cm, SH: ${seatHeight} cm`;
    }
    
    // Build description
    let desc = '';
    if (loadability) desc += `40HC: ${loadability} sets. `;
    if (coli1NetWeight) desc += `Net Wt: ${coli1NetWeight} kg`;
    
    // Determine if electric
    const isElectric = electronic || electricityStandard.includes('CE') || electricityStandard.includes('LVD');
    const material = isElectric ? 'Steel Frame + Plywood + Electric Control' : 'Steel Frame + Plywood';
    
    const product = {
      name: model,
      sku: model,
      img: `images/products/${model}.jpg`,
      material: material,
      color: fabricLeather || 'Forma Fabric Collection',
      dimensions: dimStr,
      desc: desc,
      price: 0,
      currency: 'USD',
      moq: '20 pcs',
      leadTime: '45-60 days',
      packaging: packingType || 'Carton',
      hsCode: '9401.61',
      certifications: 'EN 12520, GPSR',
      weight: coli1NetWeight ? `${coli1NetWeight} kg` : '',
      volume: '',
      loadability: loadability ? `${loadability} sets/40HC` : '',
      features: '',
      warranty: '3 years structural, 2 years mechanism',
      supplier: 'Forma Factory',
      tags: ['sofa', isElectric ? 'electric' : 'manual'],
      status: 'new',
      images: [`images/products/${model}.jpg`],
      videoUrl: '',
      model3dUrl: '',
      notes: `Imported from ${file}`,
      compliance: 'GPSR (EU 2024)',
      performanceStandard: performanceStandard.replace(/\(.*\)/, '').trim(),
      electricityStandard: electricityStandard,
      chemicalStandard: chemicalStandard,
      standWidth: width,
      standHeight: height,
      standDepth: depth,
      openWidth: null,
      openHeight: null,
      openDepth: null,
      seatDepth: seatDepth,
      seatHeight: seatHeight,
      seatWidth: seatWidth,
      coli1Long: coli1Long,
      coli1Width: coli1Width,
      coli1Height: coli1Height,
      coli1NetWeight: coli1NetWeight,
      coli1GrossWeight: coli1GrossWeight,
      coli2Long: null,
      coli2Width: null,
      coli2Height: null,
      coli2NetWeight: null,
      coli2GrossWeight: null,
      coli3Long: null,
      coli3Width: null,
      coli3Height: null,
      coli3NetWeight: null,
      coli3GrossWeight: null,
      coli4Long: null,
      coli4Width: null,
      coli4Height: null,
      coli4NetWeight: null,
      coli4GrossWeight: null,
      fabricLeather: fabricLeather,
      seatFoam: seatFoam,
      backFoam: backFoam,
      armFoam: armFoam,
      headrestFoam: headrestFoam,
      flatSpring: flatSpring,
      toplineSpring: toplineSpring,
      webbing: webbing,
      solidWood: solidWood,
      chipboard: chipboard,
      fiberboard: fiberboard,
      plywood: plywood,
      cardboard: cardboard,
      steelFrame: steelFrame,
      separateFixed: separateFixed,
      legType: legType,
      legMaterial: legMaterial,
      legHeight: legHeight,
      manualHeadrestHeight: manualHeadrestHeight,
      manualHeadrestAngle: manualHeadrestAngle,
      footrestSeatBackAdj: footrestSeatBackAdj,
      electronic: electronic,
      manualControl: manualControl,
      heater: heater,
      massage: massage,
      usbCPort: usbCPort,
      battery: battery,
      charger: charger,
      liftUp: liftUp,
      packingType: packingType,
      boxCount: boxCount
    };
    
    // Clean null values
    Object.keys(product).forEach(k => {
      if (product[k] === null || product[k] === '' || product[k] === undefined) delete product[k];
    });
    
    newProducts.push(product);
    console.log(`Added: ${model} (${isElectric ? 'Electric' : 'Manual'})`);
    
  } catch(e) {
    console.error(`Error processing ${file}:`, e.message);
  }
}

// Add to sofas category
if (!products.sofas) products.sofas = [];
for (const p of newProducts) {
  products.sofas.push(p);
  existingSkus.add(p.sku);
}

// Sort by SKU
products.sofas.sort((a, b) => a.sku.localeCompare(b.sku));

fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
console.log(`\n✅ Added ${newProducts.length} new sofa products`);
console.log(`Total sofas: ${products.sofas.length}`);
