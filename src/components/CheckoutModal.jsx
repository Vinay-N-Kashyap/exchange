import React, { useState } from 'react';
import { X, ShieldCheck, Check, Award, Lock, FileText, Download, Building, User, Mail } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, listing, onOrderCompleted }) {
  const [tier, setTier] = useState('commercial');
  const [buyerName, setBuyerName] = useState('Alex Rivers');
  const [buyerEmail, setBuyerEmail] = useState('alex.rivers@designco.com');
  const [buyerOrg, setBuyerOrg] = useState('DesignCo Studio');
  
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !listing) return null;

  const getPriceForTier = (t) => {
    if (t === 'personal') return listing.price_personal || 49;
    if (t === 'commercial') return listing.price_commercial || 149;
    if (t === 'exclusive') return listing.price_exclusive || 899;
    if (t === 'enterprise') return listing.price_enterprise || 2499;
    return listing.price_personal || 49;
  };

  const selectedPrice = getPriceForTier(tier);

  const handleProcessCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.listing_id,
          license_tier: tier,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_org: buyerOrg
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      setCompletedOrder(data.order);
      setLoading(false);
      onOrderCompleted(data.order);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                {completedOrder ? 'License Sealed & Delivered' : 'Checkout & Seal License'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {completedOrder ? `Seal ID: ${completedOrder.seal_id}` : 'Immutable Provenance Ledger Seal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {completedOrder ? (
          <div className="modal-body">
            <div className="certificate-box" style={{ marginBottom: '20px' }}>
              <div className="certificate-stamp">VERIFIED SEAL</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                PinIT Provenance License Certificate
              </div>
              <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '12px' }}>{completedOrder.title}</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <div>Order ID: <strong style={{ color: '#fff' }}>{completedOrder.order_id}</strong></div>
                <div>Seal ID: <strong style={{ color: 'var(--primary)' }}>{completedOrder.seal_id}</strong></div>
                <div>License Tier: <strong style={{ color: 'var(--emerald)' }}>{completedOrder.license_tier.toUpperCase()}</strong></div>
                <div>Amount Paid: <strong style={{ color: '#fff' }}>${completedOrder.price_paid} USD</strong></div>
                <div>Buyer Name: <strong style={{ color: '#fff' }}>{completedOrder.buyer_name}</strong></div>
                <div>Organization: <strong style={{ color: '#fff' }}>{completedOrder.buyer_org}</strong></div>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                wordBreak: 'break-all',
                fontFamily: 'monospace'
              }}>
                SHA256 DNA Hash: {completedOrder.dna_hash_summary}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => alert(`Deliverable Package and License Seal ${completedOrder.seal_id} downloaded successfully!`)}
              >
                <Download size={16} /> Download Deliverable & Certificate
              </button>
              <button className="btn-secondary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProcessCheckout} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div className="modal-body">
              {errorMsg && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
                  {errorMsg}
                </div>
              )}

              {/* Selected Listing Summary */}
              <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
                <img 
                  src={listing.preview_url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'} 
                  alt={listing.title} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`badge-${listing.badge_tier.toLowerCase()}`}>
                      <Award size={12} /> {listing.badge_tier} Badge
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.human_percent}% Human Originality</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{listing.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Creator: {listing.creator_name || 'Elena Rostova'} ({listing.pinit_id})</p>
                </div>
              </div>

              {/* License Tier Selection */}
              <div className="form-group">
                <label className="form-label">Select License Tier</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { id: 'personal', name: 'Personal License', price: listing.price_personal || 49, desc: 'Individual projects & personal portfolio' },
                    { id: 'commercial', name: 'Commercial License', price: listing.price_commercial || 149, desc: 'Client work, marketing, online monetization' },
                    { id: 'exclusive', name: 'Exclusive Buyout', price: listing.price_exclusive || 899, desc: 'Full ownership buyout, delists from Exchange' },
                    { id: 'enterprise', name: 'Enterprise Seat', price: listing.price_enterprise || 2499, desc: 'Unlimited team seats + institutional indemnity' }
                  ].map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setTier(t.id)}
                      style={{
                        border: tier === t.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: tier === t.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
                        <span>{t.name}</span>
                        <span style={{ color: 'var(--emerald)' }}>${t.price}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buyer Identity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Buyer Full Name</label>
                  <input type="text" className="form-input" value={buyerName} onChange={e => setBuyerName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Buyer Email</label>
                  <input type="email" className="form-input" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company / Organization Name</label>
                <input type="text" className="form-input" value={buyerOrg} onChange={e => setBuyerOrg(e.target.value)} />
              </div>

              {/* Payment Summary */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>License Subtotal:</span>
                  <span style={{ color: '#fff' }}>${selectedPrice.toFixed(2)} USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Provenance Ledger Seal Fee:</span>
                  <span style={{ color: 'var(--emerald)' }}>INCLUDED</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#fff', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span>Total Due:</span>
                  <span style={{ color: 'var(--emerald)' }}>${selectedPrice.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sealing Transaction...' : `Pay $${selectedPrice} & Mint Provenance Seal`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
