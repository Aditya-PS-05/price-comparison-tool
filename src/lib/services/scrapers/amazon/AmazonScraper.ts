import { Product } from '../../../types/product';
import { BaseScraper } from '../base/BaseScraper';
import * as cheerio from 'cheerio';

export class AmazonScraper extends BaseScraper {
  constructor(domain: string = 'amazon.com') {
    super({
      baseUrl: `https://${domain}`,
      selectors: {
        productName: '[data-component-type="s-search-result"] h2 a span, [data-component-type="s-search-result"] .a-link-normal .a-text-normal',
        price: '.a-price-whole, .a-price .a-offscreen',
        link: '[data-component-type="s-search-result"] h2 a',
        seller: '.a-size-base-plus',
        rating: '.a-icon-alt',
        availability: '.a-color-success, .a-color-price'
      },
      antiDetection: {
        useProxy: true,
        rotateUserAgent: true,
        randomDelay: true
      }
    });
  }

  protected buildSearchUrl(query: string): string {
    return `${this.config.baseUrl}/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss`;
  }

  extractProducts(html: string, query: string): Product[] {
    const $ = cheerio.load(html);
    const products: Product[] = [];

    $('[data-component-type="s-search-result"]').each((index, element) => {
      try {
        const $el = $(element);
        
        // Extract product name
        const nameEl = $el.find('h2 a span').first();
        const productName = nameEl.text().trim();
        
        if (!productName) return;

        // Extract price
        const priceEl = $el.find('.a-price .a-offscreen').first();
        let price = priceEl.text().trim();
        if (!price) {
          const wholePriceEl = $el.find('.a-price-whole').first();
          price = wholePriceEl.text().trim();
        }
        
        if (!price) return;

        // Extract link
        const linkEl = $el.find('h2 a').first();
        const relativeLink = linkEl.attr('href');
        const link = relativeLink ? `${this.config.baseUrl}${relativeLink}` : '';

        // Extract rating
        const ratingEl = $el.find('.a-icon-alt').first();
        const ratingText = ratingEl.text();
        const ratingMatch = ratingText.match(/(\d+\.?\d*) out of/);
        const sellerRating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

        // Extract image
        const imageEl = $el.find('img').first();
        const image = imageEl.attr('src') || '';

        // Extract availability
        const availabilityEl = $el.find('.a-color-success, .a-color-price').first();
        const availability = availabilityEl.text().trim() || 'Check availability';

        const product: Product = {
          productName,
          price: this.normalizePrice(price),
          currency: 'USD', // TODO: Make dynamic based on domain
          link,
          seller: 'Amazon',
          sellerRating,
          shippingCost: '0',
          totalCost: this.normalizePrice(price),
          availability,
          condition: 'New',
          estimatedDelivery: '2-3 business days',
          trustScore: this.calculateTrustScore(sellerRating, 1000),
          sourceWebsite: this.config.baseUrl.replace('https://', ''),
          lastUpdated: new Date().toISOString(),
          image: image.startsWith('http') ? image : `https:${image}`
        };

        products.push(product);
      } catch (error) {
        console.error('Error extracting product:', error);
      }
    });

    return products.slice(0, 10); // Limit to top 10 results
  }
}