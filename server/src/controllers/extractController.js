// controllers/extractController.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function extractImage(req, res) {
  const { productUrl } = req.body;
  if (!productUrl) return res.status(400).json({ error: 'No URL provided' });

  try {
    const browser = await puppeteer.launch({
      headless: 'new', // use 'new' for Puppeteer v19+
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set a real user-agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    );

    // Set headers to look more human-like
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    await page.goto(productUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });

   const imageUrl = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'))
    .map(img => img.getAttribute('src') || img.getAttribute('data-src') || '')
    .filter(src => src && src.startsWith('http') && !src.includes('svg'));

  return imgs.length ? imgs[0] : null;
});


    await browser.close();

    if (!imageUrl) return res.status(404).json({ error: 'No image found' });
    res.json({ image: imageUrl });

  } catch (err) {
    console.error('❌ Puppeteer error:', err);
    res.status(500).json({ error: 'Image extraction failed' });
  }
}

