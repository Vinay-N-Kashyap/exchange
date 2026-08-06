import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, PlusCircle, ExternalLink, Award, FileCode, Search, Radio, Eye, Key, Link2, AlertTriangle, Fingerprint } from 'lucide-react';

export default function HubSim({ user, onOpenListFromHub, onSwitchToExchange }) {
  const [hubAssets, setHubAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHubTab, setActiveHubTab] = useState('vault');

  useEffect(() => {
    fetchHubAssets();
  }, [user]);

  const defaultPreviews = [
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
  ];

  const fetchHubAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hub/assets?pinit_id=${user?.pinit_id || 'PINIT-90481234'}`);
      if (res.ok) {
        const data = await res.json();
        setHubAssets(data);
      }
    } catch (err) {
      console.error("Error fetching Hub assets:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Banner explaining Hub */}
      <div className="glass-panel" style={{
        padding: '36px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--indigo)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
              <Lock size={18} /> PRIVATE OWNER APP
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '8px' }}>PinIT Hub — Vault &amp; Protection Engine</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px', lineHeight: '1.6' }}>
              PinIT Hub is your private owner workspace. Here you generate camera sensor DNA, encrypt master vault files, manage Smart Link share tracking, and run background leak crawlers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={onSwitchToExchange}>
              <ExternalLink size={16} /> Open PinIT Exchange
            </button>
            <button className="btn-primary" onClick={onOpenListFromHub}>
              <PlusCircle size={16} /> Protect &amp; List on Exchange
            </button>
          </div>
        </div>
      </div>

      {/* PinIT Hub Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px', overflowX: 'auto' }}>
        {[
          { id: 'vault', label: `Encrypted Master Vault (${hubAssets.length})`, icon: Key },
          { id: 'dna', label: 'Sensor DNA Records', icon: Fingerprint },
          { id: 'tracking', label: 'Smart Link Share Tracking', icon: Link2 },
          { id: 'forensics', label: 'Leak Forensics & Crawlers', icon: AlertTriangle }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveHubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                border: 'none',
                background: 'none',
                color: activeHubTab === tab.id ? '#fff' : 'var(--text-muted)',
                borderBottom: activeHubTab === tab.id ? '2px solid var(--indigo)' : '2px solid transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Hub Tab Contents */}
      {activeHubTab === 'vault' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Private Encrypted Master Vault Assets</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Only accessible to owner ({user?.name || 'Elena Rostova'} — {user?.pinit_id || 'PINIT-90481234'}). Never exposed publicly.</p>
            </div>
            <button className="btn-primary" onClick={onOpenListFromHub} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <PlusCircle size={14} /> Protect &amp; List New Asset
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading Hub Vault Assets...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {hubAssets.map((asset, idx) => {
                const preview = asset.preview_url || defaultPreviews[idx % defaultPreviews.length];
                return (
                  <div key={asset.asset_id} className="glass-panel" style={{ padding: '16px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ height: '170px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', background: '#0f172a' }}>
                      <img src={preview} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className={`badge-${asset.badge_tier.toLowerCase()}`}>
                        <Award size={12} /> {asset.badge_tier}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--emerald)' }}>{asset.human_percent}% Human</span>
                    </div>
                    <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.title}</h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      Asset ID: {asset.asset_id} • DNA: {asset.dna_record_id}
                    </div>
                    <button className="btn-primary" onClick={onOpenListFromHub} style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.85rem' }}>
                      List on PinIT Exchange
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeHubTab === 'dna' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Camera Sensor DNA Records</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Hardware SHA-256 fingerprints generated upon file upload into PinIT Hub.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hubAssets.map(asset => (
              <div key={asset.asset_id} style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Record: {asset.dna_record_id}</span>
                  <span className={`badge-${asset.badge_tier.toLowerCase()}`}>{asset.badge_tier} Tier</span>
                </div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{asset.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace', marginTop: '6px' }}>
                  SHA256: 0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d — Camera Sensor Signature Verified
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeHubTab === 'tracking' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Smart Link Share Tracking</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Track views, downloads, and re-shares on private owner Smart Links generated from Hub.</p>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontSize: '0.88rem' }}>
            <div style={{ color: 'var(--emerald)', fontWeight: 600, marginBottom: '4px' }}>● 14 Active Smart Links Monitoring</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Zero unauthorized downloads detected across active shares.</div>
          </div>
        </div>
      )}

      {activeHubTab === 'forensics' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Background Web Leak Forensics</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Automated background crawlers scanning public web, social media, and torrent sites for unauthorized leaks of sold assets.</p>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', fontSize: '0.88rem' }}>
            <div style={{ color: 'var(--emerald)', fontWeight: 600, marginBottom: '4px' }}>● All 5 Listed Assets Under Continuous Crawl Protection</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Hub Forensic Crawlers scan 1.2M web nodes daily.</div>
          </div>
        </div>
      )}
    </div>
  );
}
