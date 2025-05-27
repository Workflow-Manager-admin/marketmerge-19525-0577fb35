import React, { useState } from "react";

/*
  Color Scheme:
    Primary: #1976D2 (blue)
    Secondary: #FFFFFF (white)
    Accent: #43A047 (green)
  Theme: Light
*/

/**
 * Marketplace logo SVGs for grid/listing cards.
 */
const marketplaceLogos = {
  craigslist: (
    <svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="#8d41e8" /><text x="7" y="17" fontSize="12" fill="#fff">C</text></svg>
  ),
  facebook: (
    <svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="#1976D2" /><text x="7" y="17" fontSize="12" fill="#fff">F</text></svg>
  ),
  nextdoor: (
    <svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="#43A047" /><text x="3" y="17" fontSize="12" fill="#fff">ND</text></svg>
  ),
};

// Reusable fallback/mock items. Used if live results are not available (see fetch* functions below).
const sampleResults = [
  {
    id: "1",
    marketplace: "craigslist",
    title: "Vintage Bike",
    price: "$120",
    image: "https://via.placeholder.com/180?text=Craigslist+Bike",
    location: "San Francisco, CA",
    description: "A classic city vintage bike in good condition.",
    link: "https://sfbay.craigslist.org/...",
  },
  {
    id: "2",
    marketplace: "facebook",
    title: "Coffee Table",
    price: "$60",
    image: "https://via.placeholder.com/180?text=FB+Coffee+Table",
    location: "Oakland, CA",
    description: "Modern wood coffee table. Gently used.",
    link: "https://facebook.com/marketplace/item/...",
  },
  {
    id: "3",
    marketplace: "nextdoor",
    title: "Sofa Couch",
    price: "$250",
    image: "https://via.placeholder.com/180?text=ND+Sofa",
    location: "Berkeley, CA",
    description: "Comfortable 3-seater, pickup only.",
    link: "https://nextdoor.com/for_sale_and_free/...",
  },
];

/**
 * Try to fetch live results from Craigslist (open endpoint may be CORS-blocked).
 * Reference: https://www.craigslist.org/about/CL-API, but no official open REST API.
 * Fallbacks to mock data and explains integration details in a comment.
 *
 * @param {string} query Search keywords
 * @param {string} location String (city, zip, etc)
 * @returns {Promise<array>} Array of listing objects
 */
async function fetchCraigslistListings(query, location) {
  // --- BEGIN MOCK FETCH/FALLBACK LOGIC ---
  // There is no public, CORS-unlocked Craigslist API. For production, you would:
  // 1. Implement a Node.js/Express backend or serverless API that scrapes craigslist.org for search results.
  // 2. The frontend calls the backend API to avoid CORS issues.
  // 3. See https://github.com/josephg/craigslist or similar npm scraping libraries.
  // For this mock, we just return filtered local dummy results:

  // Simulate async.
  await new Promise((r) => setTimeout(r, 300));
  return sampleResults.filter(
    (item) =>
      item.marketplace === "craigslist" &&
      (!query || item.title.toLowerCase().includes(query.toLowerCase())) &&
      (!location || item.location.toLowerCase().includes(location.toLowerCase()))
  );
}

/**
 * Try to fetch live results from Facebook Marketplace.
 * FB API for listings is private (https://developers.facebook.com/docs/graph-api), no public access.
 * See note in code for production workaround (backend scraping or authorized Graph API via user access token).
 *
 * @param {string} query Search keywords
 * @param {string} location
 * @returns {Promise<array>} Array of listing objects
 */
async function fetchFacebookMarketplaceListings(query, location) {
  // --- BEGIN MOCK FETCH/FALLBACK LOGIC ---
  // Facebook Marketplace restricts public API access (Graph API does not permit marketplace scraping for regular apps).
  // In production:
  // 1. Use backend scraping (Node/puppeteer/Cheerio), or
  // 2. Attempt to automate with a logged-in user cookie/token for a backend process (TOS caveat!).
  // 3. "Unofficial" APIs exist but may violate FB terms.
  // Mock for demo:
  await new Promise((r) => setTimeout(r, 300));
  return sampleResults.filter(
    (item) =>
      item.marketplace === "facebook" &&
      (!query || item.title.toLowerCase().includes(query.toLowerCase())) &&
      (!location || item.location.toLowerCase().includes(location.toLowerCase()))
  );
}

/**
 * Try to fetch live results from Nextdoor.
 * No public API for listings; web scraping/backend relay required for production.
 *
 * @param {string} query Search keywords
 * @param {string} location
 * @returns {Promise<array>} Array of listing objects
 */
async function fetchNextdoorListings(query, location) {
  // --- BEGIN MOCK FETCH/FALLBACK LOGIC ---
  // Nextdoor does not expose a public marketplace/search API.
  // In production:
  // 1. Backend proxy for scraping nextdoor.com/for_sale_and_free/ or using headless browser automation.
  // 2. Respect TOS and privacy as some listings are user-restricted.
  // Mock for demo:
  await new Promise((r) => setTimeout(r, 300));
  return sampleResults.filter(
    (item) =>
      item.marketplace === "nextdoor" &&
      (!query || item.title.toLowerCase().includes(query.toLowerCase())) &&
      (!location || item.location.toLowerCase().includes(location.toLowerCase()))
  );
}

/**
 * MarketMergeContainer
 * Handles user input for keywords/location, fetches results from all 3 sources, and displays the unified grid.
 * If live data source APIs are inaccessible, falls back to mock/demo data returned by above fetch* functions.
 */
// PUBLIC_INTERFACE
function MarketMergeContainer() {
  // State for search/filter inputs
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]); // Start empty
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For future error msg display (CORS, etc.)
  const [detailItem, setDetailItem] = useState(null);

  // PUBLIC_INTERFACE
  async function handleSearchSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Parallel fetch - in real-world you'd handle errors and partial results
      const [craigslist, facebook, nextdoor] = await Promise.all([
        fetchCraigslistListings(keywords, location),
        fetchFacebookMarketplaceListings(keywords, location),
        fetchNextdoorListings(keywords, location),
      ]);
      // Merge and sort results. (Sort by title for demo simplicity.)
      const all = [...craigslist, ...facebook, ...nextdoor].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setResults(all);
    } catch (err) {
      setError("Failed to fetch listings. (Check network/credentials/APIs.)");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Load demo results on initial mount (for first view UX)
  React.useEffect(() => {
    (async function demoStartup() {
      // Simulate default unified results on load
      setLoading(true);
      const [craigslist, facebook, nextdoor] = await Promise.all([
        fetchCraigslistListings("", ""),
        fetchFacebookMarketplaceListings("", ""),
        fetchNextdoorListings("", ""),
      ]);
      setResults([...craigslist, ...facebook, ...nextdoor]);
      setLoading(false);
    })();
  }, []);

  // PUBLIC_INTERFACE
  function handleCardClick(item) {
    setDetailItem(item);
  }

  // PUBLIC_INTERFACE
  function closeModal() {
    setDetailItem(null);
  }

  return (
    <div className="mm-root">
      <form className="mm-searchbar" onSubmit={handleSearchSubmit}>
        <input
          className="mm-input"
          type="text"
          placeholder="Search items (e.g. bicycle)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <input
          className="mm-input"
          type="text"
          placeholder="Location (e.g. San Francisco, CA)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="mm-btn mm-btn-primary" type="submit">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mm-filters">
        {/* Always-visible filters (mirror search bar above) */}
        <div>
          <label className="mm-label">Keyword:</label>
          <input
            className="mm-input"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="bicycle, couch, table..."
            disabled={loading}
          />
        </div>
        <div>
          <label className="mm-label">Location:</label>
          <input
            className="mm-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="city, zip code, etc."
            disabled={loading}
          />
        </div>
      </div>

      <div className="mm-results-header">
        <h2>
          {loading
            ? "Loading results..."
            : results.length === 0
            ? "No listings found."
            : `Results (${results.length})`}
        </h2>
        {error && <div style={{color: "#d32f2f", marginTop: "8px"}}>{error}</div>}
      </div>

      <div className="mm-results-grid">
        {results.map((item) => (
          <div
            className="mm-card"
            key={item.id}
            onClick={() => handleCardClick(item)}
            style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto" }}
          >
            <img className="mm-card-img" src={item.image} alt={item.title} />
            <div className="mm-card-content">
              <h3 className="mm-card-title">{item.title}</h3>
              <div className="mm-card-price">{item.price}</div>
              <div className="mm-card-meta">
                <span>{marketplaceLogos[item.marketplace]}</span>
                <span className="mm-card-marketplace">{item.marketplace}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Details Modal */}
      {detailItem && (
        <div className="mm-modal-overlay" onClick={closeModal}>
          <div
            className="mm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="mm-modal-close" onClick={closeModal}>×</button>
            <img className="mm-modal-img" src={detailItem.image} alt={detailItem.title} />
            <h2 className="mm-modal-title">{detailItem.title}</h2>
            <div className="mm-modal-price">{detailItem.price}</div>
            <div className="mm-modal-location">{detailItem.location}</div>
            <div className="mm-modal-description">{detailItem.description}</div>
            <div className="mm-modal-marketplace">
              {marketplaceLogos[detailItem.marketplace]}
              <span>
                {detailItem.marketplace.charAt(0).toUpperCase() + detailItem.marketplace.slice(1)}
              </span>
            </div>
            <a
              className="mm-btn mm-btn-accent"
              href={detailItem.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Original Listing
            </a>
          </div>
        </div>
      )}

      {/* 
        === API/Integration Notes (inline documentation) ===

        To use live, real listings from Craigslist, Facebook, or Nextdoor instead of the mock results:
          - You must implement a backend relay/proxy/serverless endpoint that:
              1. Fetches or scrapes data from the relevant marketplace (as none offer public REST APIs with CORS enabled).
              2. Avoids CORS/issues by having the backend make the HTTP request.
          - The provided fetch* functions should be replaced to call:
              fetch("/api/craigslist?query=...&location=...")
              fetch("/api/facebook?query=...&location=...")
              fetch("/api/nextdoor?query=...&location=...")
          - The backend (Node.js/Express or serverless function) must:
              * Scrape the site, parse relevant listings, and return the result in the format shown above.
              * Handle authentication for Facebook if you plan to access a real user's listing data.
              * See documentation/comments on TOS/legality for scraping each site.

          This UI is ready for pluggable live data via such a backend!
      */}
    </div>
  );
}

export default MarketMergeContainer;
