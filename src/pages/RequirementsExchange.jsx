import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Calendar, Send, PlusCircle, ShieldCheck, X } from 'lucide-react';

export default function RequirementsExchange({ onBack }) {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [buyerName, setBuyerName] = useState('');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vertical, setVertical] = useState('concepts');
  const [budget, setBudget] = useState(2500);
  const [deadline, setDeadline] = useState('2026-09-15');

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requirements');
      if (res.ok) {
        const data = await res.json();
        setRequirements(data);
      }
    } catch (err) {
      console.error("Error fetching requirements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequirement = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_name: buyerName,
          buyer_org: buyerOrg,
          title: title,
          description: description,
          vertical: vertical,
          budget: budget,
          deadline: deadline
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchRequirements();
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error("Error creating requirement:", err);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#fff' }}>Requirement Exchange</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Open briefs from verified enterprise buyers seeking custom provenance digital assets.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={18} /> Post Buyer Brief
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading Open Briefs...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {requirements.map(req => (
            <div key={req.req_id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="brand-badge" style={{ fontSize: '0.7rem' }}>{req.vertical.toUpperCase()}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald)' }}>${req.budget} USD</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>{req.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>{req.description}</p>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                Buyer: <strong style={{ color: '#fff' }}>{req.buyer_name}</strong> ({req.buyer_org})
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Proposals: {req.proposals_count}</span>
                <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  <Send size={14} /> Submit Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Post Buyer Requirement Brief</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateRequirement} className="modal-body">
              <div className="form-group">
                <label className="form-label">Buyer Name</label>
                <input type="text" className="form-input" value={buyerName} onChange={e => setBuyerName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Company / Organization</label>
                <input type="text" className="form-input" value={buyerOrg} onChange={e => setBuyerOrg(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Brief Title</label>
                <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Detailed Deliverable Description</label>
                <textarea className="form-textarea" rows="3" value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Budget ($ USD)</label>
                  <input type="number" className="form-input" value={budget} onChange={e => setBudget(Number(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Vertical</label>
                  <select className="form-select" value={vertical} onChange={e => setVertical(e.target.value)}>
                    <option value="images">Photography</option>
                    <option value="video">Video 8K</option>
                    <option value="ui_ux">UI/UX Systems</option>
                    <option value="3d">3D Models</option>
                    <option value="audio">Audio Stems</option>
                    <option value="concepts">Concepts</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                Publish Requirement Brief
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
