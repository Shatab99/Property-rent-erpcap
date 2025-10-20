// app/api/scrape/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ],
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Navigating to listings page...');
    
    // Navigate to your local listings page
    await page.goto('http://localhost:3000/listings', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log('Page loaded successfully');

    // Wait for content to load
    // await new Promise(resolve => setTimeout(resolve, 3000));

    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // Take screenshot for analysis
    const screenshot = await page.screenshot({ 
      path: 'listings-screenshot.png', 
      fullPage: true 
    });

    // Try to scrape property data from your local page
    const properties = await page.evaluate(() => {
      console.log('=== SCRAPING LOCAL LISTINGS ===');
      
      // Selectors for your local listings page
      const selectors = [
        '.property-card',
        '.listing-item',
        '.property-listing',
        '[data-property]',
        '.card', // Common card selector
        '.property'
      ];
      
      let foundElements: Element[] = [];
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`Selector "${selector}": found ${elements.length} elements`);
        if (elements.length > 0) {
          foundElements.push(...Array.from(elements));
        }
      });

      // If no specific selectors work, try generic approach
      if (foundElements.length === 0) {
        console.log('No property selectors found, trying generic approach...');
        const allElements = document.querySelectorAll('div, article, section');
        foundElements = Array.from(allElements).filter(element => {
          const text = element.textContent?.toLowerCase() || '';
          return text.includes('$') && (text.includes('bed') || text.includes('bath') || text.includes('rent'));
        });
        console.log(`Found ${foundElements.length} elements with property-like content`);
      }

      return Array.from(foundElements).slice(0, 20).map((element, index) => {
        try {
          const text = element.textContent || '';
          
          // Extract data using multiple approaches
          const titleSelectors = ['h1', 'h2', 'h3', 'h4', '.title', '.property-title', '.card-title'];
          const priceSelectors = ['.price', '.rent', '.cost', '.amount'];
          const addressSelectors = ['.address', '.location'];
          
          const findText = (selectors: string[]) => {
            for (const selector of selectors) {
              const el = element.querySelector(selector);
              if (el?.textContent?.trim()) return el.textContent.trim();
            }
            return '';
          };

          // Extract price with regex fallback
          const extractPrice = () => {
            const foundPrice = findText(priceSelectors);
            if (foundPrice) return foundPrice;
            
            const priceMatch = text.match(/\$[\d,]+(?:\.\d{2})?/);
            return priceMatch ? priceMatch[0] : '';
          };

          // Extract other info
          const extractBedrooms = () => {
            const bedMatch = text.match(/(\d+)\s*(?:bed|br|bedroom)/i);
            return bedMatch ? bedMatch[1] + ' bed' : '';
          };

          const extractBathrooms = () => {
            const bathMatch = text.match(/(\d+(?:\.\d)?)\s*(?:bath|ba|bathroom)/i);
            return bathMatch ? bathMatch[1] + ' bath' : '';
          };

          const extractSqft = () => {
            const sqftMatch = text.match(/(\d+(?:,\d+)?)\s*(?:sq\.?\s*ft|sqft|square feet)/i);
            return sqftMatch ? sqftMatch[1] + ' sqft' : '';
          };

          return {
            index,
            title: findText(titleSelectors) || text.substring(0, 50).trim(),
            price: extractPrice(),
            address: findText(addressSelectors),
            bedrooms: extractBedrooms(),
            bathrooms: extractBathrooms(),
            sqft: extractSqft(),
            image: element.querySelector('img')?.src || '',
            link: element.querySelector('a')?.href || '',
            mlsNumber: '',
            elementTag: element.tagName,
            elementClasses: element.className,
            hasData: !!(extractPrice() || extractBedrooms() || extractBathrooms())
          };
        } catch (err) {
          console.error('Error processing element:', err);
          return null;
        }
      }).filter(Boolean);
    });

    // Filter valid properties
    const validProperties = properties.filter(property => 
      property && (
        property.hasData || 
        property.price || 
        (property.title && property.title.length > 5)
      )
    );

    return NextResponse.json({
      success: true,
      properties: validProperties,
      count: validProperties.length,
      totalScanned: properties.length,
      screenshotTaken: true,
      debug: {
        pageTitle,
        pageUrl: 'http://localhost:3000/listings',
        propertiesFound: validProperties.length,
        totalElementsScanned: properties.length
      }
    });

  } catch (err: any) {
    console.error('Scraper error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
}
