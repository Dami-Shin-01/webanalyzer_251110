const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const CSSParser = require('../parsers/CSSParser');

/**
 * StaticAnalyzer - Analyzes HTML and CSS files to extract design tokens
 * Handles HTML download, CSS file extraction, and network error recovery
 */
class StaticAnalyzer {
  constructor(options = {}) {
    this.timeout = options.timeout || 30000; // 30 seconds default
    this.maxRetries = options.maxRetries || 2;
    this.userAgent = options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    this.cssParser = new CSSParser();
  }

  /**
   * Main analysis method
   * @param {string} url - Target website URL
   * @returns {Promise<Object>} Extracted tokens and metadata
   */
  async analyze(url) {
    const startTime = Date.now();
    
    try {
      // Step 1: Download HTML
      const html = await this.fetchHTML(url);
      
      // Step 2: Extract inline CSS from <style> tags
      const inlineCSS = this.extractInlineCSS(html);
      
      // Step 3: Extract CSS links from HTML
      const cssUrls = this.extractCSSLinks(html, url);
      
      // Step 4: Download and merge CSS files
      const mergedCSS = await this.fetchCSS(cssUrls, url);
      
      // Step 5: Combine inline and external CSS
      const allCSS = {
        ...mergedCSS,
        content: inlineCSS + '\n\n' + mergedCSS.content
      };
      
      // Step 6: Parse tokens
      const tokens = this.parseTokens(allCSS);
      
      const duration = Date.now() - startTime;
      
      return {
        tokens,
        metadata: {
          analyzedUrl: url,
          timestamp: new Date().toISOString(),
          duration,
          cssFilesFound: cssUrls.length,
          cssFilesDownloaded: mergedCSS.filesDownloaded || 0,
          filesFailed: mergedCSS.filesFailed || 0,
          hasCORSIssues: mergedCSS.hasCORSIssues || false,
          errors: mergedCSS.errors || []
        }
      };
    } catch (error) {
      throw this.handleError(error, url);
    }
  }

  /**
   * Fetch HTML content from URL
   * @param {string} url - Target URL
   * @returns {Promise<string>} HTML content
   */
  async fetchHTML(url) {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400
      });

      if (!response.data) {
        throw new Error('Empty response received');
      }

      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      if (error.response) {
        throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
      }
      if (error.code === 'ENOTFOUND') {
        throw new Error('Domain not found. Please check the URL.');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. The server may be down.');
      }
      throw error;
    }
  }

  /**
   * Extract inline CSS from <style> tags
   * @param {string} html - HTML content
   * @returns {string} Combined inline CSS content
   */
  extractInlineCSS(html) {
    const $ = cheerio.load(html);
    let inlineCSS = '';
    
    $('style').each((i, elem) => {
      const styleContent = $(elem).html();
      if (styleContent) {
        inlineCSS += `\n/* Inline <style> tag ${i + 1} */\n`;
        inlineCSS += styleContent;
        inlineCSS += '\n\n';
      }
    });
    
    console.log(`Extracted inline CSS from ${$('style').length} <style> tags`);
    return inlineCSS;
  }

  /**
   * Extract CSS file URLs from HTML
   * @param {string} html - HTML content
   * @param {string} baseUrl - Base URL for resolving relative paths
   * @returns {Array<string>} Array of CSS file URLs
   */
  extractCSSLinks(html, baseUrl) {
    const $ = cheerio.load(html);
    const cssUrls = [];
    const seenUrls = new Set();

    // Extract <link rel="stylesheet"> tags
    $('link[rel="stylesheet"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href) {
        try {
          const absoluteUrl = this.resolveUrl(href, baseUrl);
          if (!seenUrls.has(absoluteUrl)) {
            cssUrls.push(absoluteUrl);
            seenUrls.add(absoluteUrl);
          }
        } catch (error) {
          console.warn(`Failed to resolve CSS URL: ${href}`, error.message);
        }
      }
    });

    // Also check for <style> tags with @import
    $('style').each((i, elem) => {
      const styleContent = $(elem).html();
      if (styleContent) {
        const importUrls = this.extractImportUrls(styleContent, baseUrl);
        importUrls.forEach(url => {
          if (!seenUrls.has(url)) {
            cssUrls.push(url);
            seenUrls.add(url);
          }
        });
      }
    });

    console.log(`Found ${cssUrls.length} CSS file(s) in HTML`);
    return cssUrls;
  }

  /**
   * Extract @import URLs from CSS content
   * @param {string} css - CSS content
   * @param {string} baseUrl - Base URL for resolving relative paths
   * @returns {Array<string>} Array of imported CSS URLs
   */
  extractImportUrls(css, baseUrl) {
    const importRegex = /@import\s+(?:url\()?['"]?([^'")]+)['"]?\)?/g;
    const urls = [];
    let match;

    while ((match = importRegex.exec(css)) !== null) {
      try {
        const absoluteUrl = this.resolveUrl(match[1], baseUrl);
        urls.push(absoluteUrl);
      } catch (error) {
        console.warn(`Failed to resolve @import URL: ${match[1]}`);
      }
    }

    return urls;
  }

  /**
   * Resolve relative URL to absolute URL
   * @param {string} href - Relative or absolute URL
   * @param {string} baseUrl - Base URL
   * @returns {string} Absolute URL
   */
  resolveUrl(href, baseUrl) {
    // Handle protocol-relative URLs
    if (href.startsWith('//')) {
      const baseProtocol = new URL(baseUrl).protocol;
      return `${baseProtocol}${href}`;
    }
    
    // Handle absolute URLs
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return href;
    }
    
    // Handle relative URLs
    return new URL(href, baseUrl).href;
  }

  /**
   * Download and merge multiple CSS files
   * @param {Array<string>} cssUrls - Array of CSS file URLs
   * @param {string} baseUrl - Base URL for context
   * @returns {Promise<Object>} Merged CSS content and metadata
   */
  async fetchCSS(cssUrls, baseUrl) {
    if (cssUrls.length === 0) {
      console.warn('No CSS files found to download');
      return {
        content: '',
        filesDownloaded: 0,
        filesFailed: 0,
        errors: []
      };
    }

    const results = await Promise.allSettled(
      cssUrls.map(url => this.downloadCSSFile(url))
    );

    let mergedContent = '';
    let filesDownloaded = 0;
    let filesFailed = 0;
    const errors = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        mergedContent += `\n/* Source: ${cssUrls[index]} */\n`;
        mergedContent += result.value;
        mergedContent += '\n\n';
        filesDownloaded++;
      } else {
        filesFailed++;
        const errorMsg = `Failed to download ${cssUrls[index]}: ${result.reason.message}`;
        console.warn(errorMsg);
        errors.push({
          url: cssUrls[index],
          error: result.reason.message,
          isCORS: this.isCORSError(result.reason)
        });
      }
    });

    console.log(`Downloaded ${filesDownloaded}/${cssUrls.length} CSS files`);
    
    if (filesFailed > 0) {
      console.warn(`Failed to download ${filesFailed} CSS file(s)`);
    }

    // Check if CORS is a major issue
    const corsErrors = errors.filter(e => e.isCORS);
    if (corsErrors.length > 0) {
      console.warn(`⚠️  CORS errors detected for ${corsErrors.length} file(s)`);
      console.warn('Note: CORS restrictions prevent direct CSS file access from some domains.');
    }

    return {
      content: mergedContent,
      filesDownloaded,
      filesFailed,
      errors,
      hasCORSIssues: corsErrors.length > 0
    };
  }

  /**
   * Download a single CSS file
   * @param {string} url - CSS file URL
   * @returns {Promise<string>} CSS content
   */
  async downloadCSSFile(url) {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/css,*/*;q=0.1',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400
      });

      return response.data;
    } catch (error) {
      // Enhance error message for better debugging
      if (error.code === 'ECONNABORTED') {
        throw new Error(`Timeout after ${this.timeout}ms`);
      }
      if (error.response) {
        throw new Error(`HTTP ${error.response.status}`);
      }
      if (error.code === 'ENOTFOUND') {
        throw new Error('Domain not found');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused');
      }
      throw error;
    }
  }

  /**
   * Check if error is CORS-related
   * @param {Error} error - Error object
   * @returns {boolean} True if CORS error
   */
  isCORSError(error) {
    const message = error.message?.toLowerCase() || '';
    const corsIndicators = [
      'cors',
      'cross-origin',
      'access-control-allow-origin'
    ];
    
    return corsIndicators.some(indicator => message.includes(indicator));
  }

  /**
   * Parse tokens from CSS content
   * @param {Object} cssData - CSS content and metadata
   * @returns {Object} Extracted tokens
   */
  parseTokens(cssData) {
    const css = cssData.content || '';
    
    return {
      colors: this.cssParser.extractColors(css),
      fonts: this.cssParser.extractFonts(css),
      spacing: this.cssParser.extractSpacing(css),
      effects: this.cssParser.extractEffects(css),
      animations: this.cssParser.extractKeyframes(css)
    };
  }

  /**
   * Handle and format errors
   * @param {Error} error - Original error
   * @param {string} url - Target URL
   * @returns {Error} Formatted error
   */
  handleError(error, url) {
    const formattedError = new Error(error.message);
    formattedError.type = 'network';
    formattedError.url = url;
    formattedError.originalError = error;
    
    // Add specific error types
    if (error.message.includes('timeout')) {
      formattedError.type = 'timeout';
    } else if (error.message.includes('HTTP')) {
      formattedError.type = 'http';
    } else if (error.message.includes('not found')) {
      formattedError.type = 'not_found';
    } else if (this.isCORSError(error)) {
      formattedError.type = 'cors';
    }
    
    return formattedError;
  }
}

module.exports = StaticAnalyzer;
