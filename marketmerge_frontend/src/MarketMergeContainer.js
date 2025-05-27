import React, { useState } from "react";

/*
  Color Scheme:
    Primary: #1976D2 (blue)
    Secondary: #FFFFFF (white)
    Accent: #43A047 (green)
  Theme: Light
*/

/**
 * Dummy marketplace logos (placeholder SVG)
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

/**
 * Dummy data for wireframe purposes.
 */
const sampleResults = [
  {
    id: "1",
    marketplace: "craigslist",
    title: "Vintage Bike",
    price: "$120",
    image: "https://via.placeholder.com/180?text=Image",
    location: "San Francisco, CA",
    description: "A classic city vintage bike in good condition.",
    link: "https://craigslist.org/vintage-bike",
  },
  {
    id: "2",
    marketplace: "facebook",
    title: "Coffee Table",
    price: "$60",
    image: "https://via.placeholder.com/180?text=Image",
    location: "Oakland, CA",
    description: "Modern wood coffee table. Gently used.",
    link: "https://facebook.com/coffee-table",
  },
  {
    id: "3",
    marketplace: "nextdoor",
    title: "Sofa Couch",
    price: "$250",
    image: "https://via.placeholder.com/180?text=Image",
    location: "Berkeley, CA",
    description: "Comfortable 3-seater, pickup only.",
    link: "https://nextdoor.com/sofa-couch",
  },
];

/**
 * Search bar, filters, listing grid, item detail modal.
 */
// PUBLIC_INTERFACE
function MarketMergeContainer() {
  // State for search/filter inputs
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  // In real app, results would be fetched after search.
  const [results, setResults] = useState(sampleResults);
  // Modal state
  const [detailItem, setDetailItem] = useState(null);

  // PUBLIC_INTERFACE
  function handleSearchSubmit(e) {
    e.preventDefault();
    // Placeholder: filter dummy results by keyword if present
    if (!keywords && !location) {
      setResults(sampleResults);
      return;
    }
    setResults(
      sampleResults.filter(
        (item) =>
          (keywords
            ? item.title.toLowerCase().includes(keywords.toLowerCase())
            : true) &&
          (location
            ? item.location.toLowerCase().includes(location.toLowerCase())
            : true)
      )
    );
  }

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
        <button className="mm-btn mm-btn-primary" type="submit">Search</button>
      </form>

      <div className="mm-filters">
        {/* Always-visible filters - for wireframe, just re-display inputs */}
        <div>
          <label className="mm-label">Keyword:</label>
          <input
            className="mm-input"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="bicycle, couch, table..."
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
          />
        </div>
      </div>

      <div className="mm-results-header">
        <h2>
          {results.length === 0
            ? "No listings found."
            : `Results (${results.length})`}
        </h2>
      </div>

      <div className="mm-results-grid">
        {results.map((item) => (
          <div className="mm-card" key={item.id} onClick={() => handleCardClick(item)}>
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

      {/* Modal for detail view */}
      {detailItem && (
        <div className="mm-modal-overlay" onClick={closeModal}>
          <div className="mm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="mm-modal-close" onClick={closeModal}>×</button>
            <img className="mm-modal-img" src={detailItem.image} alt={detailItem.title} />
            <h2 className="mm-modal-title">{detailItem.title}</h2>
            <div className="mm-modal-price">{detailItem.price}</div>
            <div className="mm-modal-location">{detailItem.location}</div>
            <div className="mm-modal-description">{detailItem.description}</div>
            <div className="mm-modal-marketplace">
              {marketplaceLogos[detailItem.marketplace]}
              <span>{detailItem.marketplace.charAt(0).toUpperCase() + detailItem.marketplace.slice(1)}</span>
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
    </div>
  );
}

export default MarketMergeContainer;
