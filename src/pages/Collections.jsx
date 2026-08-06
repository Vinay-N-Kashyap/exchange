import React, { useState } from 'react';
import { Layers, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export default function Collections({ onSelectListing }) {
  const [selectedCollection, setSelectedCollection] = useState('all');

  const collections = [
    {
      id: 'cyberpunk',
      title: 'Cyberpunk Cities & Neo-Futurism',
      count: '14 Verified Assets',
      provenanceScore: '98% Gold Tier',
      description: 'Hyper-detailed twilight cityscapes and cyberpunk architecture verified with Hasselblad camera sensor DNA.',
      banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'nordic',
      title: 'Nordic Aerial Fjord 8K Series',
      count: '9 Verified Assets',
      provenanceScore: '99% Gold Tier',
      description: 'Raw 8K RED and drone surveys of Scandinavian fjords captured under natural Arctic light.',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'quantum',
      title: 'Quantum UI/UX Component Kits',
      count: '22 Verified Assets',
      provenanceScore: '92% Silver Tier',
      description: 'Glassmorphic dashboard component frameworks designed for Web3 & enterprise AI consoles.',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3d_sculptures',
      title: 'Biomechanical 3D Sculptures',
      count: '18 Verified Assets',
      provenanceScore: '88% Silver Tier',
      description: 'High-poly 3D organic meshes with procedural PBR metallic materials for game engines & VFX.',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>Curated Provenance Collections</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Hand-curated digital asset themes backed by Hub camera sensor DNA and legal licensing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '24px' }}>
        {collections.map(col => (
          <div key={col.id} className="glass-panel" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => onSelectListing('L-101')}>
            <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
              <img src={col.banner} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="watermark-overlay">
                <div className="watermark-text">PINIT COLLECTION</div>
              </div>
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <span className="badge-gold"><Award size={12} /> {col.provenanceScore}</span>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                {col.count}
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>{col.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>{col.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--emerald)', fontWeight: 600 }}>Verified Vault Provenance</span>
                <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Collection <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
