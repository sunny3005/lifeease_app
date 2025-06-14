const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kowsik111#',  // ✅ Replace with your actual password
  database: 'fashion_app'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ MySQL Connected');
});

// Create table if not exists
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS outfits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image TEXT NOT NULL,
    category VARCHAR(50) NOT NULL
  )
`;
db.query(createTableSQL, (err) => {
  if (err) {
    console.error('❌ Error creating table:', err.message);
  } else {
    console.log('✅ Table "outfits" is ready');
  }
});

// API: Insert outfit
app.post('/api/outfits', (req, res) => {
  const { image, category } = req.body;
  if (!image || !category) {
    return res.status(400).json({ error: 'Missing image or category' });
  }

  const insertSQL = 'INSERT INTO outfits (image, category) VALUES (?, ?)';
  db.query(insertSQL, [image, category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, image, category });
  });
});

// API: Get outfits by category
app.get('/api/outfits/:category', (req, res) => {
  const category = req.params.category;
  const selectSQL = 'SELECT * FROM outfits WHERE category = ? ORDER BY id DESC';
  db.query(selectSQL, [category], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// API: Extract image from product URL (Myntra, Ajio, etc.)
app.post('/api/extract-image', async (req, res) => {
  const { productUrl } = req.body;

  if (!productUrl) {
    return res.status(400).json({ error: 'Missing product URL' });
  }

  try {
    const { data } = await axios.get(productUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);
    const imageUrl = $('meta[property="og:image"]').attr('content');

    if (imageUrl) {
      return res.json({ image: imageUrl });
    } else {
      return res.status(404).json({ error: 'No image found in the page' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to extract image', details: err.message });
  }
});


const puppeteer = require('puppeteer');

app.post('/api/extract-image', async (req, res) => {
  const { productUrl } = req.body;
  if (!productUrl) return res.status(400).json({ error: 'No URL provided' });

  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Try to find largest visible image on page
    const imageUrl = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'))
        .filter(img => img.width > 200 && img.height > 200)
        .map(img => img.src);
      return imgs.length ? imgs[0] : null;
    });

    await browser.close();

    if (!imageUrl) return res.status(404).json({ error: 'No image found' });
    return res.json({ image: imageUrl });
  } catch (err) {
    console.error('❌ Puppeteer error:', err.message);
    return res.status(500).json({ error: 'Image extraction failed' });
  }
});




// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
