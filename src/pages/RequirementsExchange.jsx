import React, { useState, useEffect } from 'react';
import { Briefcase, PlusCircle, CheckCircle, Search, Filter, DollarSign, Clock, Building2, Send, X, ShieldCheck } from 'lucide-react';
import { apiFetchRequirements, apiCreateRequirement } from '../lib/api.js';

export default function RequirementsExchange({ user }) {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vertical, setVertical] = useState('video');
  const [budget, setBudget] = useState(3000);
  const [deadline, setDeadline] = useState('2026-09-01');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    setLoading(true);
    try {
      const data = await apiFetchRequirements();
      setRequirements(data);
    } catch (err) {
      console.error("Error fetching requirements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiCreateRequirement({
        buyer_name: user?.name || 'Enterprise Buyer',
        buyer_org: user?.agency_name || 'Acme Global Media',
        title: title,
        description: description,
        vertical: vertical,
        budget: budget,
        deadline: deadline
      });

      setSuccessMsg('Requirement brief successfully posted to Exchange!');
      setSubmitting(false);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
        loadRequirements();
      }, 1000);
    } catch (err) {
      console.error("Error posting requirement:", err);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        marginBottom: '32px',
        background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 0.95) 70%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
              <Briefcase size={16} /> BUYER SOURCING EXCHANGE
            </div>
            <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '8px' }}>Requirements &amp; Creative Briefs Feed</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px' }}>
              Enterprise buyers post custom creative briefs for Gold &amp; Silver verified creators. Submit custom proposals backed by camera sensor DNA.
            </p>
          </div>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <PlusCircle size={18} /> Post Buyer Brief
          </button>
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading Buyer Briefs...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {requirements.map(req => (
            <div key={req.req_id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)', borderRadius: '99px', fontWeight: 700 }}>
                    {req.vertical.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--emerald)', fontWeight: 700 }}>
                    Budget: ${req.budget} USD
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '8px' }}>{req.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                  {req.description}
                </p>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Posted by <strong>{req.buyer_org || req.buyer_name}</strong>
                </div>
                <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }} onClick={() => alert(`Proposal form for ${req.title} opened.`)}>
                  Submit Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Post New Buyer Requirement Brief</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {successMsg && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  {successMsg}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Brief Title</label>
                <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. 8K Aerial Footage of Tokyo Skyline" />
              </div>
              <div className="form-group">
                <label className="form-label">Description &amp; Deliverable Specs</label>
                <textarea className="form-textarea" rows="3" value={description} onChange={e => setDescription(e.target.value)} required placeholder="Detail raw resolution, frame rate, lighting, and provenance requirements..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Budget ($ USD)</label>
                  <input type="number" className="form-input" value={budget} onChange={e => setBudget(Number(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={vertical} onChange={e => setVertical(e.target.value)}>
                    <option value="video">Video 8K</option>
                    <option value="images">Photography</option>
                    <option value="ui_ux">UI/UX Systems</option>
                    <option value="3d">3D Models</option>
                    <option value="audio">Audio Stems</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Posting...' : 'Post Brief'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
