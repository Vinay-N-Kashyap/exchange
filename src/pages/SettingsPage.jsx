import React, { useState } from 'react';
import { User, ShieldCheck, CreditCard, Bell, Lock, Key, Store, Award, CheckCircle, Smartphone } from 'lucide-react';
import { apiOnboardSeller } from '../lib/api.js';

export default function SettingsPage({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('account');
  const [agencyName, setAgencyName] = useState(user?.agency_name || 'Rostova Visual Labs');
  const [bio, setBio] = useState(user?.bio || 'Award-winning architectural photographer and digital artist creating high-provenance visual assets.');
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await apiOnboardSeller({
        agency_name: agencyName,
        bio: bio
      });
      setUser(data.user);
      setKycSubmitted(true);
      setSaving(false);
    } catch (err) {
      console.error("KYC onboarding error:", err);
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '4px' }}>Account &amp; Seller Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage public seller storefront, biometric KYC, payouts, and security.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          {[
            { id: 'account', label: 'Public Profile', icon: User },
            { id: 'kyc', label: 'Seller Verification', icon: ShieldCheck },
            { id: 'billing', label: 'Payouts & Billing', icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Keys', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  marginBottom: '6px',
                  textAlign: 'left'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === 'account' && (
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Public Storefront Details</h3>
              <form onSubmit={handleKycSubmit}>
                <div className="form-group">
                  <label className="form-label">Creator / Studio Name</label>
                  <input type="text" className="form-input" value={agencyName} onChange={e => setAgencyName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio &amp; Provenance Credentials</label>
                  <textarea className="form-textarea" rows="4" value={bio} onChange={e => setBio(e.target.value)} />
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile Details'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--emerald)', marginBottom: '16px' }}>
                <CheckCircle size={24} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Biometric Seller KYC Verified</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified identity on PinIT Exchange ID: <strong>PX-772091</strong></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '12px' }}>Payout Methods &amp; Split</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Direct bank payout enabled. Standard split: <strong>85% Creator Net / 15% Platform Fee</strong>.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '12px' }}>PinIT Hub Encryption Keys</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Master vault keys generated via hardware camera sensor DNA.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
