import React, { useState, useEffect } from 'react';
import { DollarSign, Eye, Bookmark, Layers, ShieldCheck, FileCheck, PlusCircle, Award, Activity, Search, RefreshCw, Send, CheckCircle } from 'lucide-react';

export default function CreatorDesk({ user, onOpenListFromHub }) {
  const [deskData, setDeskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [proposalSuccessMsg, setProposalSuccessMsg] = useState('');

  useEffect(() => {
    fetchDeskData();
  }, [user]);

  const fetchDeskData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/creator/desk?pinit_id=${user?.pinit_id || 'PINIT-90481234'}`);
      if (res.ok) {
        const data = await res.json();
        setDeskData(data);
      }
    } catch (err) {
      console.error("Error fetching creator desk data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (reqId) => {
    try {
      const res = await fetch(`/api/requirements/${reqId}/propose`, { method: 'POST' });
      if (res.ok) {
        setProposalSuccessMsg(`Proposal submitted to brief ${reqId}`);
        fetchDeskData();
        setTimeout(() => setProposalSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error("Error submitting proposal:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '60px 24px', color: 'var(--text-muted)', textAlign: 'center' }}>
        Loading Creator Desk Analytics...
      </div>
    );
  }

  const { metrics, listings, sealed_sales, tracking_jobs, requirements } = deskData || {};

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>Creator Desk</h1>
            <span className="brand-badge" style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              VERIFIED SELLER: {deskData?.user?.exchange_id || 'PX-772091'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage listings, inspect sealed sales ledger, view earnings, and monitor post-sale tracking.
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenListFromHub}>
          <PlusCircle size={18} /> List Asset from Hub
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
            <span>Net Revenue</span>
            <DollarSign size={18} color="var(--emerald)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)' }}>
            ${metrics?.total_net_revenue || 0} USD
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Gross Sales: ${metrics?.total_gross_revenue || 0} USD</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
            <span>Active Listings</span>
            <Layers size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {metrics?.active_listings_count || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Hub Vault Protected</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
            <span>Sealed Sales</span>
            <ShieldCheck size={18} color="var(--indigo)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {metrics?.sealed_sales_count || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Immutable Ledger Records</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
            <span>Marketplace Views</span>
            <Eye size={18} color="var(--cyan)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {metrics?.total_views || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{metrics?.total_saves || 0} Saves</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
        {[
          { id: 'overview', label: 'Overview & Activity' },
          { id: 'listings', label: `My Listings (${listings?.length || 0})` },
          { id: 'sales', label: `Sealed Sales Ledger (${sealed_sales?.length || 0})` },
          { id: 'earnings', label: 'Earnings & Payouts' },
          { id: 'tracking', label: `Post-Sale Hub Tracking (${tracking_jobs?.length || 0})` },
          { id: 'requirements', label: `Buyer Requirements (${requirements?.length || 0})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {proposalSuccessMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
          {proposalSuccessMsg}
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Recent Desk Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sealed_sales?.map(s => (
              <div key={s.seal_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '14px 18px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={20} color="var(--emerald)" />
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>Sale Sealed: {s.seal_id}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Buyer: {s.buyer_name} ({s.buyer_org}) • License: {s.license_tier.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--emerald)', fontWeight: 800, fontSize: '1rem' }}>+${s.creator_net} USD</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Net Earnings</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>My Active & Paused Listings</h3>
          <div className="listings-grid">
            {listings?.map(item => (
              <div key={item.listing_id} className="glass-card" style={{ cursor: 'default' }}>
                <div className="card-media-wrapper" style={{ height: '160px' }}>
                  <img src={item.preview_url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'} alt={item.title} className="card-media" />
                  <div className="card-badge-container">
                    <span className={`badge-${item.badge_tier.toLowerCase()}`}>
                      <Award size={12} /> {item.badge_tier}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>{item.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Personal: ${item.price_personal} | Commercial: ${item.price_commercial}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                    <span style={{ color: item.status === 'live' ? 'var(--emerald)' : 'var(--badge-gold)' }}>
                      ● {item.status.toUpperCase()}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>{item.views || 0} Views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Sealed Sales Ledger</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Append-only tamper-proof provenance log of all completed purchases.
          </p>
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Seal ID</th>
                <th>Order ID</th>
                <th>Buyer Name / Org</th>
                <th>License Tier</th>
                <th>Gross Paid</th>
                <th>Platform Fee (15%)</th>
                <th>Creator Net (85%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sealed_sales?.map(s => (
                <tr key={s.seal_id}>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{s.seal_id}</td>
                  <td>{s.order_id}</td>
                  <td>{s.buyer_name} ({s.buyer_org})</td>
                  <td style={{ textTransform: 'uppercase', color: 'var(--emerald)' }}>{s.license_tier}</td>
                  <td>${s.price_paid}</td>
                  <td style={{ color: 'var(--text-muted)' }}>${s.platform_fee}</td>
                  <td style={{ color: 'var(--emerald)', fontWeight: 700 }}>${s.creator_net}</td>
                  <td><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700 }}>SEALED</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Earnings & Payout Transparency</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Available Payout Balance</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--emerald)', margin: '8px 0' }}>
                ${metrics?.total_net_revenue || 0} USD
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Automatic weekly payout via direct bank transfer or Stripe.</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Platform Fee Model</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '8px 0' }}>
                85% Creator Cut / 15% Platform & Provenance Fee
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Fee covers Hub vault storage, camera sensor DNA verification, and post-sale monitoring.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>Post-Sale PinIT Hub Monitoring Jobs</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Continuous background web crawlers monitoring sold licenses for unauthorized leaks or license misuse.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tracking_jobs?.map(job => (
              <div key={job.job_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '14px 18px', borderRadius: '8px' }}>
                <div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>Tracking Job: {job.job_id}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Linked Seal: {job.seal_id} • Asset: {job.asset_id}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ color: 'var(--emerald)', fontSize: '0.8rem', fontWeight: 600 }}>● Active Monitoring</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>0 Leaks Detected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requirements' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Open Buyer Requirements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {requirements?.map(req => (
              <div key={req.req_id} style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{req.title}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted by: {req.buyer_name} ({req.buyer_org})</div>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald)' }}>
                    ${req.budget} USD
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{req.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Proposals: {req.proposals_count}</span>
                  <button className="btn-secondary" onClick={() => handleSubmitProposal(req.req_id)} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                    <Send size={14} /> Submit Proposal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
