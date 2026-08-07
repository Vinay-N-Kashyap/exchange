import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Lock, ArrowLeft, CheckCircle, ExternalLink, Download, FileText, Sparkles, UserCheck, Shield } from 'lucide-react';
import { apiFetchListingDetail } from '../lib/api.js';

export default function ListingDetail({ listingId, onBack, onOpenCheckout }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState('commercial');

  useEffect(() => {
    if (listingId) {
      loadDetail();
    }
  }, [listingId]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await apiFetchListingDetail(listingId);
      setListing(data);
    } catch (err) {
      console.error("Error fetching listing detail:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Loading Provenance Record...
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <h3 style={{ color: '#fff' }}>Listing Not Found</h3>
        <button className="btn-secondary" onClick={onBack} style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} /> Back to Exchange
        </button>
      </div>
    );
  }

  const tiers = [
    { id: 'personal', name: 'Personal License', price: listing.price_personal || 49, desc: 'Single user, non-commercial portfolio & educational projects' },
    { id: 'commercial', name: 'Commercial License', price: listing.price_commercial || 149, desc: 'Client deliverables, social media campaigns & digital ads' },
    { id: 'exclusive', name: 'Exclusive Buyout', price: listing.price_exclusive || 899, desc: 'Full exclusive rights, asset is delisted from Exchange' },
    { id: 'enterprise', name: 'Enterprise Seat', price: listing.price_enterprise || 2499, desc: 'Multi-seat org license, legal indemnity & RAW master access' }
  ];

  const currentPrice = listing[`price_${selectedTier}`] || listing.price_personal || 149;

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Exchange
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
        {/* Left Column: Media Preview & DNA Fingerprint */}
        <div>
          <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '24px', padding: 0 }}>
            <div style={{ position: 'relative', width: '100%', height: '420px', background: '#000' }}>
              <img 
                src={listing.preview_url} 
                alt={listing.title} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <div className="watermark-overlay">
                <div className="watermark-text">PINIT PROVENANCE SEAL</div>
              </div>
              <div className="card-badge-container">
                <span className={`badge-${listing.badge_tier ? listing.badge_tier.toLowerCase() : 'gold'}`}>
                  <Award size={14} /> {listing.badge_tier || 'Gold'} Authenticity Badge
                </span>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '12px' }}>{listing.title}</h1>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{listing.description}</p>
            </div>
          </div>

          {/* Provenance & Sensor DNA Record */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldCheck size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>PinIT Hub DNA &amp; Sensor Fingerprint</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Hub DNA Record ID</span>
                <strong style={{ color: 'var(--primary)' }}>{listing.dna_record_id || 'DNA-9001-GOLD'}</strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Human vs AI Ratio</span>
                <strong style={{ color: 'var(--emerald)' }}>{listing.human_percent || 95}% Human Originality</strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Hub Vault Status</span>
                <strong style={{ color: '#fff' }}>AES-256 Sealed Master</strong>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>AI Training Policy</span>
                <strong style={{ color: 'var(--emerald)' }}>Opted Out (Protected)</strong>
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '10px 14px',
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              wordBreak: 'break-all'
            }}>
              SHA256 DNA Hash: {listing.dna_hash || '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d'}
            </div>
          </div>
        </div>

        {/* Right Column: License Tier Selector & Creator Passport */}
        <div>
          {/* Creator Passport Card */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              Verified Creator Passport
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--indigo))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#fff'
              }}>
                {listing.creator_name ? listing.creator_name[0] : 'E'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{listing.creator_name || 'Elena Rostova'}</h4>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700 }}>
                    KYC VERIFIED
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  PinIT ID: <strong>{listing.pinit_id || 'PINIT-90481234'}</strong> | Exchange ID: <strong>{listing.creator_exchange_id || 'PX-772091'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* License Purchase Selector */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Select License Tier</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {tiers.map(t => (
                <div 
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  style={{
                    border: selectedTier === t.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: selectedTier === t.id ? 'rgba(59, 130, 246, 0.12)' : 'rgba(0,0,0,0.2)',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: selectedTier === t.id ? '5px solid var(--primary)' : '2px solid var(--text-muted)'
                      }} />
                      {t.name}
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald)' }}>${t.price} USD</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '24px' }}>{t.desc}</p>
                </div>
              ))}
            </div>

            {/* Fee Transparency Note */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '20px'
            }}>
              Includes instant downloadable high-res deliverable + immutable <strong>PinIT License Seal Certificate</strong> logged to the provenance ledger.
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem' }}
              onClick={() => onOpenCheckout(listing)}
            >
              Buy {selectedTier.toUpperCase()} License (${currentPrice})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
