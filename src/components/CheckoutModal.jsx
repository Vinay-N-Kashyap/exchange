import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle, FileText, Download, Award, AlertCircle, Building2, ExternalLink } from 'lucide-react';
import { apiCheckout } from '../lib/api';

export default function CheckoutModal({ isOpen, onClose, listing, user, onOrderComplete }) {
  const [selectedTier, setSelectedTier] = useState('commercial');
  const [buyerName, setBuyerName] = useState('Enterprise Client');
  const [buyerEmail, setBuyerEmail] = useState('buyer@enterprise.org');
  const [buyerOrg, setBuyerOrg] = useState('Acme Global Media');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [sealedOrder, setSealedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !listing) return null;

  const tiers = [
    { id: 'personal', name: 'Personal License', price: listing.price_personal || 49, desc: 'Single user non-commercial portfolio' },
    { id: 'commercial', name: 'Commercial License', price: listing.price_commercial || 149, desc: 'Commercial campaigns, digital ads & client work' },
    { id: 'exclusive', name: 'Exclusive Buyout', price: listing.price_exclusive || 899, desc: 'Full exclusive rights, asset is delisted from Exchange' },
    { id: 'enterprise', name: 'Enterprise Seat', price: listing.price_enterprise || 2499, desc: 'Multi-seat org license with RAW master access & indemnity' }
  ];

  const currentPrice = listing[`price_${selectedTier}`] || listing.price_personal || 149;
  const platformFee = Number((currentPrice * 0.15).toFixed(2));
  const creatorNet = Number((currentPrice * 0.85).toFixed(2));

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await apiCheckout({
        listing_id: listing.listing_id,
        asset_id: listing.asset_id,
        seller_pinit_id: listing.pinit_id,
        seller_exchange_id: listing.creator_exchange_id || 'PX-772091',
        buyer_pinit_id: user?.pinit_id || 'BUYER-881902',
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_org: buyerOrg,
        license_tier: selectedTier,
        price_paid: currentPrice,
        dna_hash_summary: listing.dna_hash || '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d'
      });

      setSealedOrder(data.seal);
      setLoading(false);
    } catch (err) {
      setErrorMsg(err.message || 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: sealedOrder ? '720px' : '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="var(--emerald)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>
                {sealedOrder ? 'Transaction Sealed & Rights Granted' : 'PinIT Exchange Checkout'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {sealedOrder ? 'Immutable License Certificate logged to PinIT Provenance Ledger' : 'Hardware DNA & License Rights Acquisition'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {sealedOrder ? (
          /* Render Digital License Certificate Seal */
          <div className="modal-body">
            <div className="certificate-box" style={{ marginBottom: '24px' }}>
              <div className="certificate-stamp">SEALED &amp; VERIFIED</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
                <ShieldCheck size={18} /> PINIT EXCHANGE LICENSE CERTIFICATE
              </div>

              <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '8px' }}>{listing.title}</h2>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Licensed to: <strong style={{ color: '#fff' }}>{sealedOrder.buyer_name} ({sealedOrder.buyer_org || 'Independent'})</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem', marginBottom: '20px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Seal ID</span>
                  <strong style={{ color: 'var(--emerald)' }}>{sealedOrder.seal_id}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Order ID</span>
                  <strong style={{ color: '#fff' }}>{sealedOrder.order_id}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>License Tier</span>
                  <strong style={{ color: 'var(--primary)', textTransform: 'uppercase' }}>{sealedOrder.license_tier}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Authenticity Badge</span>
                  <strong style={{ color: 'var(--badge-gold)' }}>{listing.badge_tier} ({listing.human_percent}% Human)</strong>
                </div>
              </div>

              {/* Fee Split Transparency */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                <span>Total Amount: <strong style={{ color: '#fff' }}>${sealedOrder.price_paid} USD</strong></span>
                <span>Creator Net (85%): <strong style={{ color: 'var(--emerald)' }}>${sealedOrder.creator_net} USD</strong></span>
                <span>Platform Fee (15%): <strong>${sealedOrder.platform_fee} USD</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                onClick={() => {
                  alert(`Downloading high-resolution deliverable for ${listing.title}...`);
                  onOrderComplete && onOrderComplete(sealedOrder);
                  onClose();
                }}
              >
                <Download size={18} /> Download Asset Deliverables &amp; Certificate
              </button>
            </div>
          </div>
        ) : (
          /* Render Checkout Form */
          <form onSubmit={handleCheckoutSubmit} className="modal-body">
            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', color: '#f87171', fontSize: '0.88rem', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            {/* Asset Summary */}
            <div style={{ display: 'flex', gap: '16px', padding: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', marginBottom: '20px' }}>
              <img src={listing.preview_url} alt={listing.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
              <div>
                <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>{listing.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Creator: {listing.creator_name || 'Elena Rostova'} • <span style={{ color: 'var(--emerald)' }}>{listing.badge_tier} Badge</span>
                </div>
              </div>
            </div>

            {/* Select Tier */}
            <div className="form-group">
              <label className="form-label">Select License Tier</label>
              <select className="form-select" value={selectedTier} onChange={e => setSelectedTier(e.target.value)}>
                {tiers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} — ${t.price} USD ({t.desc})
                  </option>
                ))}
              </select>
            </div>

            {/* Buyer Contact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Buyer Full Name</label>
                <input type="text" className="form-input" value={buyerName} onChange={e => setBuyerName(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Work Email</label>
                <input type="email" className="form-input" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Company / Organization Name</label>
              <input type="text" className="form-input" value={buyerOrg} onChange={e => setBuyerOrg(e.target.value)} placeholder="e.g. Acme Media Corp" />
            </div>

            {/* Payment Summary */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <span>License Fee ({selectedTier.toUpperCase()})</span>
                <strong style={{ color: '#fff' }}>${currentPrice} USD</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <span>PinIT Provenance Seal Minting</span>
                <span style={{ color: 'var(--emerald)' }}>INCLUDED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--emerald)' }}>${currentPrice} USD</span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sealing Transaction...' : `Confirm & Pay $${currentPrice} USD`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
