import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Award, FileText, CheckCircle } from 'lucide-react';

export default function MyLicenses({ user, onViewCertificate }) {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyLicenses();
  }, []);

  const fetchMyLicenses = async () => {
    setLoading(true);
    try {
      // Fetch creator desk sealed sales as sample buyer licenses
      const res = await fetch(`/api/creator/desk?pinit_id=${user?.pinit_id || 'PINIT-90481234'}`);
      if (res.ok) {
        const data = await res.json();
        setLicenses(data.sealed_sales || []);
      }
    } catch (err) {
      console.error("Error fetching licenses:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>My Purchased Licenses</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Your verified license certificates logged in the PinIT provenance ledger.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading My Licenses...</div>
      ) : licenses.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <ShieldCheck size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#fff' }}>No Purchased Licenses Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Explore the marketplace to buy verified provenance licenses.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {licenses.map(lic => (
            <div key={lic.seal_id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className="brand-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                      VERIFIED SEAL: {lic.seal_id}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order: {lic.order_id}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>License Package #{lic.listing_id}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Buyer: {lic.buyer_name} ({lic.buyer_org}) • License Tier: <strong style={{ color: 'var(--emerald)', textTransform: 'uppercase' }}>{lic.license_tier}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>${lic.price_paid} USD</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 600 }}>PAID &amp; SEALED</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                fontFamily: 'monospace',
                marginBottom: '16px',
                wordBreak: 'break-all'
              }}>
                SHA256 Fingerprint: {lic.dna_hash_summary}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={() => onViewCertificate(lic.seal_id)}>
                  <FileText size={16} /> View License Certificate
                </button>
                <button className="btn-primary" onClick={() => alert(`Downloading high-res master package for ${lic.seal_id}...`)}>
                  <Download size={16} /> Download Master Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
