// controllers/extractController.js
import puppeteer from 'puppeteer';

export async function extractImage(req, res) {
  const { productUrl } = req.body;
  if (!productUrl) return res.status(400).json({ error: 'No URL provided' });

  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    const imageUrl = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'))
        .filter(img => img.width > 200 && img.height > 200)
        .map(img => img.src);
      return imgs.length ? imgs[0] : null;
    });

    await browser.close();
    if (!imageUrl) return res.status(404).json({ error: 'No image found' });
    res.json({ image: imageUrl });

  } catch (err) {
    console.error('❌ Puppeteer error:', err.message);
    res.status(500).json({ error: 'Image extraction failed' });
  }
}
