import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Award, Mail, ExternalLink, CheckCircle, Sparkles, X } from 'lucide-react';

export default function CreatorPassports({ user }) {
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [hireMsg, setHireMsg] = useState('');

  const creators = [
    {
      pinit_id: 'PINIT-90481234',
      exchange_id: 'PX-772091',
      name: 'Elena Rostova',
      role: 'Architectural Photographer & Digital Artist',
      bio: 'Award-winning photographer specializing in camera sensor DNA verified urban architecture and aerial landscapes.',
      kyc_status: 'VERIFIED',
      biometric: 'BIOMETRIC MATCHED',
      sales_count: 42,
      rating: '99.8%',
      vertical: 'Photography / Images',
      avatar: 'E',
      portfolio: [
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      pinit_id: 'PINIT-33109284',
      exchange_id: 'PX-441802',
      name: 'Marcus Vance',
      role: 'Cinematographer & 3D Environment Designer',
      bio: 'VFX supervisor creating procedural 3D PBR meshes and 8K cinema drone timelapses.',
      kyc_status: 'VERIFIED',
      biometric: 'BIOMETRIC MATCHED',
      sales_count: 28,
      rating: '99.1%',
      vertical: 'Video & 3D Models',
      avatar: 'M',
      portfolio: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      pinit_id: 'PINIT-BUYER-001',
      exchange_id: 'PX-109284',
      name: 'Sophia Chen',
      role: 'Creative Director & Enterprise Buyer',
      bio: 'Leading creative design team at Aether Dynamics, licensing high-provenance digital assets.',
      kyc_status: 'VERIFIED',
      biometric: 'BIOMETRIC MATCHED',
      sales_count: 19,
      rating: '100%',
      vertical: 'Enterprise Media',
      avatar: 'S',
      portfolio: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>Verified Creator Passports</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Explore identity-verified creators with biometric KYC checks, Exchange IDs, and provenance ratings.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {creators.map(c => (
          <div key={c.pinit_id} className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--indigo))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#fff',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
              }}>
                {c.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>{c.name}</h3>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700 }}>
                    KYC OK
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{c.role}</div>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>{c.bio}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <div>PinIT ID: <strong style={{ color: '#fff' }}>{c.pinit_id}</strong></div>
              <div>Exchange ID: <strong style={{ color: 'var(--primary)' }}>{c.exchange_id}</strong></div>
              <div>Sales Sealed: <strong style={{ color: 'var(--emerald)' }}>{c.sales_count}</strong></div>
              <div>Provenance Rating: <strong style={{ color: 'var(--badge-gold)' }}>{c.rating}</strong></div>
            </div>

            {/* Portfolio Preview */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {c.portfolio.map((img, i) => (
                <img key={i} src={img} alt="portfolio" style={{ width: '32%', height: '64px', objectFit: 'cover', borderRadius: '6px' }} />
              ))}
            </div>

            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setSelectedCreator(c)}>
              <Mail size={16} /> Contact / Hire Creator
            </button>
          </div>
        ))}
      </div>

      {selectedCreator && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Contact {selectedCreator.name}</h3>
              <button onClick={() => setSelectedCreator(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {hireMsg ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '14px', borderRadius: '8px' }}>
                  {hireMsg}
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Send a direct custom project brief or commission inquiry to verified creator <strong>{selectedCreator.name}</strong> ({selectedCreator.exchange_id}).
                  </p>
                  <div className="form-group">
                    <label className="form-label">Project Brief Details</label>
                    <textarea className="form-textarea" rows="3" placeholder="Describe scope, budget, and delivery timeline..." />
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setHireMsg('Inquiry sent successfully to creator desk!'); setTimeout(() => { setSelectedCreator(null); setHireMsg(''); }, 1500); }}>
                    Send Direct Inquiry
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
