import React, { useState, useEffect } from 'react';
import { Search, Filter, Award, ShieldCheck, Sparkles, Eye, Bookmark, ExternalLink, ArrowRight, Layers } from 'lucide-react';

export default function Marketplace({ onSelectListing, onOpenListFromHub }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    fetchListings();
  }, [selectedVertical, selectedBadge, sortOption]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = `/api/listings?vertical=${selectedVertical}&badge=${selectedBadge}&sort=${sortOption}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const verticalsList = [
    { id: 'all', name: 'All Verticals' },
    { id: 'images', name: 'Photography' },
    { id: 'video', name: 'Video 8K' },
    { id: 'ui_ux', name: 'UI/UX Systems' },
    { id: '3d', name: '3D Models & PBR' },
    { id: 'audio', name: 'Audio Stems' },
    { id: 'concepts', name: 'Concepts & Briefs' }
  ];

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Hero Section */}
      <div className="glass-panel" style={{
        padding: '48px',
        marginBottom: '40px',
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.85) 60%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            <ShieldCheck size={16} />
            <span>PinIT Hub DNA &amp; Vault Protection Powered</span>
          </div>

          <h1 style={{ fontSize: '2.8rem', lineHeight: '1.15', marginBottom: '16px', color: '#fff' }}>
            The Verified Provenance Exchange for Digital Assets
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: '1.6' }}>
            Buy and sell high-trust creative assets backed by camera sensor DNA, vault encryption, and automated post-sale leak tracking.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-primary" onClick={onOpenListFromHub} style={{ padding: '12px 24px', fontSize: '1rem' }}>
              List Asset from Hub <ArrowRight size={18} />
            </button>
            <a href="#browse-section" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem', textDecoration: 'none' }}>
              Browse Exchange
            </a>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div id="browse-section" style={{ marginBottom: '32px' }}>
        {/* Verticals Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {verticalsList.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVertical(v.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 600,
                border: selectedVertical === v.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: selectedVertical === v.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                color: selectedVertical === v.id ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {v.name}
            </button>
          ))}
        </div>

        {/* Search & Secondary Filters */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '300px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by keyword, camera sensor, tags, or title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <button type="submit" className="btn-secondary">
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select 
                className="form-select" 
                value={selectedBadge} 
                onChange={e => setSelectedBadge(e.target.value)}
                style={{ width: 'auto', minWidth: '180px' }}
              >
                <option value="all">All Authenticity Badges</option>
                <option value="Gold">Gold Badge (90-100% Human)</option>
                <option value="Silver">Silver Badge (60-80% Human)</option>
                <option value="Bronze">Bronze Badge (&lt;60% Human)</option>
              </select>
            </div>

            <select 
              className="form-select" 
              value={sortOption} 
              onChange={e => setSortOption(e.target.value)}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="newest">Newest Listings</option>
              <option value="popular">Most Viewed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading PinIT Exchange listings...
        </div>
      ) : listings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <ShieldCheck size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>No Listings Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search terms or filter selection.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map(item => (
            <div key={item.listing_id} className="glass-card" onClick={() => onSelectListing(item.listing_id)} style={{ cursor: 'pointer' }}>
              <div className="card-media-wrapper">
                <img src={item.preview_url} alt={item.title} className="card-media" />
                <div className="watermark-overlay">
                  <div className="watermark-text">PINIT EXCHANGE</div>
                </div>
                <div className="card-badge-container">
                  <span className={`badge-${item.badge_tier.toLowerCase()}`}>
                    <Award size={12} /> {item.badge_tier}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span>{item.creator_name || 'Elena Rostova'}</span>
                  <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{item.human_percent}% Human</span>
                </div>

                <h3 className="card-title">{item.title}</h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Personal License</span>
                    <span className="card-price">${item.price_personal} USD</span>
                  </div>

                  <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                    View Provenance
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
