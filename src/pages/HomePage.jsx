import React from 'react';
import { ShieldCheck, Award, Lock, ArrowRight, Layers, Sparkles, FileCheck, Building2, UserCheck, CheckCircle, Fingerprint, Eye, Activity } from 'lucide-react';

export default function HomePage({ onNavigate, onOpenListFromHub }) {
  const steps = [
    {
      num: '01',
      title: 'Protect in Hub Vault',
      desc: 'Upload master files into private AES-256 encrypted Hub Vault.',
      icon: Lock,
      color: 'var(--indigo)'
    },
    {
      num: '02',
      title: 'Mint Camera Sensor DNA',
      desc: 'Generate hardware SHA-256 camera sensor fingerprint & AI composition ratio.',
      icon: Fingerprint,
      color: 'var(--primary)'
    },
    {
      num: '03',
      title: 'List on Exchange',
      desc: 'Enforce ≤80% AI cutoff policy and assign Gold/Silver/Bronze trust badges.',
      icon: ShieldCheck,
      color: 'var(--badge-gold)'
    },
    {
      num: '04',
      title: 'Seal Sale & Monitor Leaks',
      desc: 'Mint append-only License Certificate seal while Hub crawlers monitor leaks.',
      icon: FileCheck,
      color: 'var(--emerald)'
    }
  ];

  const featuredAssets = [
    {
      id: 'L-101',
      title: 'Cybernetic Neo-Tokyo Architecture',
      creator: 'Elena Rostova',
      badge: 'Gold',
      human: '95%',
      price: '$79',
      img: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'L-102',
      title: 'Nordic Fjord Drone Survey 8K',
      creator: 'Elena Rostova',
      badge: 'Gold',
      human: '98%',
      price: '$129',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'L-103',
      title: 'Quantum Computing UI Component System',
      creator: 'Marcus Vance',
      badge: 'Silver',
      human: '75%',
      price: '$59',
      img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Hero Section */}
      <div className="glass-panel" style={{
        padding: '64px 48px',
        marginBottom: '48px',
        background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.95) 75%)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ maxWidth: '840px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '6px 16px',
            borderRadius: '99px',
            fontSize: '0.85rem',
            color: 'var(--primary)',
            fontWeight: 700,
            marginBottom: '24px'
          }}>
            <ShieldCheck size={16} /> PinIT Origin Network &amp; Provenance Engine
          </div>

          <h1 style={{ fontSize: '3.4rem', lineHeight: '1.1', marginBottom: '20px', color: '#fff', fontWeight: 800 }}>
            Trade Verified Digital Assets with Hardware Sensor DNA
          </h1>

          <p style={{ fontSize: '1.18rem', color: 'var(--text-muted)', marginBottom: '36px', lineHeight: '1.65' }}>
            PinIT Exchange connects verified creators and enterprise buyers on an immutable provenance ledger. Every asset is protected by <strong>PinIT Hub</strong> master vault encryption, camera sensor DNA, and continuous leak crawlers.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => onNavigate('marketplace')} style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Explore Exchange <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={onOpenListFromHub} style={{ padding: '14px 28px', fontSize: '1rem' }}>
              List Asset from Hub
            </button>
          </div>
        </div>
      </div>

      {/* Trust Stats Counter */}
      <div className="glass-panel" style={{ padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center', marginBottom: '48px' }}>
        <div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--emerald)' }}>100%</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Camera Sensor DNA Verified</div>
        </div>
        <div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)' }}>&le; 80%</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Strict AI Policy Cutoff Enforced</div>
        </div>
        <div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--indigo)' }}>85% / 15%</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Transparent Creator Net Payout</div>
        </div>
        <div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--badge-gold)' }}>AES-256</div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Hub Master Vault Encryption</div>
        </div>
      </div>

      {/* Interactive 4-Step Origin Architecture */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '8px' }}>How PinIT Provenance Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Hub protects files behind the scenes. Exchange sells verified licenses.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="glass-panel" style={{ padding: '28px', position: 'relative' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'rgba(255,255,255,0.08)', position: 'absolute', top: '16px', right: '20px' }}>
                  {step.num}
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${step.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Icon size={22} color={step.color} />
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Provenance Assets Showcase */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Featured Gold &amp; Silver Provenance Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verified human authenticity badges backed by camera sensor fingerprints.</p>
          </div>
          <button className="btn-secondary" onClick={() => onNavigate('marketplace')}>
            View All Exchange Listings <ArrowRight size={16} />
          </button>
        </div>

        <div className="listings-grid">
          {featuredAssets.map(item => (
            <div key={item.id} className="glass-card" onClick={() => onNavigate('marketplace')} style={{ cursor: 'pointer' }}>
              <div className="card-media-wrapper">
                <img src={item.img} alt={item.title} className="card-media" />
                <div className="watermark-overlay">
                  <div className="watermark-text">PINIT PROVENANCE</div>
                </div>
                <div className="card-badge-container">
                  <span className={`badge-${item.badge.toLowerCase()}`}>
                    <Award size={12} /> {item.badge} Badge
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="card-meta">
                  <span>{item.creator}</span>
                  <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{item.human} Human</span>
                </div>
                <h3 className="card-title">{item.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span className="card-price">{item.price} USD</span>
                  <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>View Provenance</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
