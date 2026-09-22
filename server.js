const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'products.json');
const IMAGES_DIR = path.join(__dirname, 'images', 'products');
const TEMPLATE_DIR = path.join(__dirname, 'templates');
const PUBLIC_DIR = __dirname;

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '');
    cb(null, `${name}${ext}`);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WebP allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_DIR));

// ---- API: Products ----

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// Get single product by SKU
app.get('/api/products/:sku', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    for (const cat of Object.keys(data)) {
      const product = data[cat].find(p => p.sku === req.params.sku);
      if (product) return res.json(product);
    }
    res.status(404).json({ error: 'Product not found' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// Create product
app.post('/api/products', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const product = req.body;
    
    // Validate required fields
    const required = ['sku', 'name', 'category', 'img', 'material', 'color', 'dimensions', 'desc'];
    for (const field of required) {
      if (!product[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    
    // Normalize category key
    const catKey = product.category;
    if (!data[catKey]) data[catKey] = [];
    
    // Check duplicate SKU
    for (const cat of Object.keys(data)) {
      if (data[cat].some(p => p.sku === product.sku)) {
        return res.status(400).json({ error: 'SKU already exists' });
      }
    }
    
    // Add product
    const { category, ...productData } = product;
    data[catKey].push(productData);
    
    // Sort by SKU
    data[catKey].sort((a, b) => a.sku.localeCompare(b.sku));
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, product: productData });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update product
app.put('/api/products/:sku', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const updates = req.body;
    let found = false;
    let oldCat = null;
    let oldIndex = -1;
    
    // Find product
    for (const cat of Object.keys(data)) {
      const idx = data[cat].findIndex(p => p.sku === req.params.sku);
      if (idx !== -1) {
        oldCat = cat;
        oldIndex = idx;
        found = true;
        break;
      }
    }
    
    if (!found) return res.status(404).json({ error: 'Product not found' });
    
    // Handle category change
    const newCat = updates.category || oldCat;
    const { category, ...productData } = updates;
    
    if (newCat !== oldCat) {
      // Remove from old category
      data[oldCat].splice(oldIndex, 1);
      if (!data[newCat]) data[newCat] = [];
      data[newCat].push(productData);
    } else {
      // Update in place
      data[oldCat][oldIndex] = { ...data[oldCat][oldIndex], ...productData };
    }
    
    // Sort
    if (data[newCat]) data[newCat].sort((a, b) => a.sku.localeCompare(b.sku));
    if (data[oldCat]) data[oldCat].sort((a, b) => a.sku.localeCompare(b.sku));
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete product
app.delete('/api/products/:sku', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    let found = false;
    
    for (const cat of Object.keys(data)) {
      const idx = data[cat].findIndex(p => p.sku === req.params.sku);
      if (idx !== -1) {
        data[cat].splice(idx, 1);
        found = true;
        break;
      }
    }
    
    if (!found) return res.status(404).json({ error: 'Product not found' });
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Upload image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `images/products/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

// Delete image
app.delete('/api/images/:filename', (req, res) => {
  try {
    const filePath = path.join(IMAGES_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List images
app.get('/api/images', (req, res) => {
  try {
    const files = fs.readdirSync(IMAGES_DIR)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map(f => ({ filename: f, url: `images/products/${f}` }));
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Regenerate HTML pages
app.post('/api/generate-pages', (req, res) => {
  try {
    const { execSync } = require('child_process');
    execSync('node generate-pages.js', { cwd: __dirname, stdio: 'inherit' });
    res.json({ success: true, message: 'Pages regenerated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin panel route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Forma Group Admin running at http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`📦 API base: http://localhost:${PORT}/api/products\n`);
});
