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
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
    });

    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });

    console.log('Navigating to MLS page...');
    
    // Navigate to the page you want to scrape
    await page.goto('https://matrix-new.onekeymlsny.com/Matrix/public/IDX.aspx?idx=02882c54', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    console.log('Page loaded successfully');

    // Wait for the page to fully load and execute JavaScript
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Try to interact with the page to trigger property loading
    try {
      // Look for and click any search or load buttons
      const searchButton = await page.$('input[type="submit"], button[type="submit"], .search-btn, #searchButton');
      if (searchButton) {
        await searchButton.click();
        console.log('Clicked search button');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (e) {
      console.log('No search button found or could not click');
    }

    // Wait for property listings to appear
    const propertySelectors = [
      '.property-listing',
      '.listing-item', 
      '.property-card',
      '.listing',
      '.search-result',
      '.property-result',
      '.idx-listing',
      '.mls-listing',
      '[data-listing-id]',
      '.listing-row'
    ];

    let propertiesFound = false;
    for (const selector of propertySelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`Found properties with selector: ${selector}`);
        propertiesFound = true;
        break;
      } catch (e) {
        console.log(`No properties found with selector: ${selector}`);
      }
    }

    if (!propertiesFound) {
      console.log('No property listings found with standard selectors, trying alternative approach...');
    }

    // Get page info first (before any other operations)
    const pageTitle = await page.title();
    const pageUrl = page.url();
    
    console.log('Page title:', pageTitle);
    console.log('Page URL:', pageUrl);

    // Try to wait for any content to load
    try {
      await page.waitForSelector('body', { timeout: 5000 });
      console.log('Body element found');
    } catch (e) {
      console.log('No body element found or timeout');
    }

    // Wait for properties to load
    await page.waitForSelector('.property-listing, .listing-item, .property-card', { timeout: 10000 }).catch(() => {});

    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

    // Get page content for debugging
    const pageContent = await page.content();
    console.log('Page content length:', pageContent.length);

    // Scrape property listings data
    const properties = await page.evaluate(() => {
      // Debug: log what elements are found
      console.log('=== DEBUGGING SELECTORS ===');
      
      // Try different possible selectors for MLS/IDX sites
      const selectors = [
        '.property-listing',
        '.listing-item', 
        '.property-card',
        '.listing',
        '.property',
        '[data-listing]',
        '[data-listing-id]',
        '.search-result',
        '.listing-card',
        '.idx-listing',
        '.mls-listing',
        '.property-result',
        '.listing-row',
        '.property-item',
        '.listing-wrapper'
      ];
      
      let foundElements: Element[] = [];
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`Selector "${selector}": found ${elements.length} elements`);
        if (elements.length > 0) {
          foundElements.push(...Array.from(elements));
        }
      });

      // If no specific selectors work, try to find elements containing property data
      if (foundElements.length === 0) {
        console.log('No property selectors found, trying content-based approach...');
        const allElements = document.querySelectorAll('div, article, section, li');
        foundElements = Array.from(allElements).filter(element => {
          const text = element.textContent?.toLowerCase() || '';
          const hasPrice = text.includes('$') && (text.match(/\$[\d,]+/) || text.match(/\$\d+/));
          const hasPropertyInfo = text.includes('bed') || text.includes('bath') || text.includes('sqft') || text.includes('acre');
          return hasPrice && hasPropertyInfo && element.children.length > 0;
        });
        console.log(`Found ${foundElements.length} elements with property-like content`);
      }

      // Extract data from found elements
      const propertyElements = foundElements.length > 0 ? foundElements : Array.from(document.querySelectorAll('*'));
      console.log(`Processing ${Math.min(propertyElements.length, 20)} elements`);
      
      return Array.from(propertyElements).slice(0, 20).map((element, index) => {
        try {
          const text = element.textContent || '';
          
          // More comprehensive selector attempts
          const titleSelectors = ['.property-title', '.listing-title', '.title', 'h1', 'h2', 'h3', 'h4', '.address'];
          const priceSelectors = ['.price', '.property-price', '.listing-price', '.cost', '.amount'];
          const addressSelectors = ['.address', '.property-address', '.location', '.street'];
          const bedroomSelectors = ['.beds', '.bedrooms', '.br', '.bed-count'];
          const bathroomSelectors = ['.baths', '.bathrooms', '.ba', '.bath-count'];
          const sqftSelectors = ['.sqft', '.square-feet', '.area', '.size'];
          
          const findText = (selectors: string[]) => {
            for (const selector of selectors) {
              const el = element.querySelector(selector);
              if (el?.textContent?.trim()) return el.textContent.trim();
            }
            return '';
          };

          // Extract price from text content if not found in specific selectors
          const extractPrice = () => {
            const foundPrice = findText(priceSelectors);
            if (foundPrice) return foundPrice;
            
            const priceMatch = text.match(/\$[\d,]+(?:\.\d{2})?/);
            return priceMatch ? priceMatch[0] : '';
          };

          // Extract bedroom info
          const extractBedrooms = () => {
            const foundBeds = findText(bedroomSelectors);
            if (foundBeds) return foundBeds;
            
            const bedMatch = text.match(/(\d+)\s*(?:bed|br|bedroom)/i);
            return bedMatch ? bedMatch[1] + ' bed' : '';
          };

          // Extract bathroom info
          const extractBathrooms = () => {
            const foundBaths = findText(bathroomSelectors);
            if (foundBaths) return foundBaths;
            
            const bathMatch = text.match(/(\d+(?:\.\d)?)\s*(?:bath|ba|bathroom)/i);
            return bathMatch ? bathMatch[1] + ' bath' : '';
          };

          return {
            index,
            title: findText(titleSelectors) || text.substring(0, 50),
            price: extractPrice(),
            address: findText(addressSelectors),
            bedrooms: extractBedrooms(),
            bathrooms: extractBathrooms(),
            sqft: findText(sqftSelectors),
            image: element.querySelector('img')?.src || '',
            link: element.querySelector('a')?.href || '',
            mlsNumber: element.querySelector('.mls-number, .listing-id, .mls-id')?.textContent?.trim() || '',
            // Debug info
            elementTag: element.tagName,
            elementClasses: element.className,
            elementText: text.substring(0, 100),
            hasPropertyData: !!(extractPrice() || extractBedrooms() || extractBathrooms())
          };
        } catch (err) {
          console.error('Error processing element:', err);
          return null;
        }
      }).filter(Boolean);
    });

    // Filter properties to only include those with actual property data
    const validProperties = properties.filter(property => 
      property && (
        property.hasPropertyData || 
        property.price || 
        property.bedrooms || 
        property.bathrooms ||
        (property.title && property.title.length > 10)
      )
    );

    return NextResponse.json({
      success: true, 
      properties: validProperties,
      count: validProperties.length,
      totalScanned: properties.length,
      debug: {
        pageTitle: pageTitle,
        pageUrl: pageUrl,
        contentLength: pageContent.length,
        propertiesFound: validProperties.length,
        totalElementsScanned: properties.length
      }
    });
  } catch (err: any) {
    console.error('Scraper error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    // Always close browser in finally block
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
}
