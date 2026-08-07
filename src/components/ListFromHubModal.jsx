import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Award, Lock, Sparkles, AlertCircle, CheckCircle, Info, DollarSign } from 'lucide-react';
import { apiFetchHubAssets, apiProtectAsset, apiPublishListing } from '../lib/api';

export default function ListFromHubModal({ isOpen, onClose, onListingCreated, user }) {
  const [hubAssets, setHubAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Asset form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vertical, setVertical] = useState('images');
  const [fileType, setFileType] = useState('image');
  const [humanPercent, setHumanPercent] = useState(90);
  const [aiPercent, setAiPercent] = useState(10);
  const [previewUrl, setPreviewUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');

  // Pricing
  const [pricePersonal, setPricePersonal] = useState(49);
  const [priceCommercial, setPriceCommercial] = useState(149);
  const [priceExclusive, setPriceExclusive] = useState(899);
  const [priceEnterprise, setPriceEnterprise] = useState(2499);
  const [aiOptOut, setAiOptOut] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const fetchAssets = async () => {
    try {
      const data = await apiFetchHubAssets(user?.pinit_id || 'PINIT-90481234');
      setHubAssets(data);
      if (data.length > 0 && !selectedAssetId) {
        setSelectedAssetId(data[0].asset_id);
        populateAssetDetails(data[0]);
      }
    } catch (err) {
      console.error("Error fetching Hub assets:", err);
    }
  };

  const populateAssetDetails = (asset) => {
    setTitle(asset.title);
    setVertical(asset.vertical || 'images');
    setFileType(asset.file_type || 'image');
    setHumanPercent(asset.human_percent !== undefined ? asset.human_percent : 90);
    setAiPercent(asset.ai_percent !== undefined ? asset.ai_percent : 10);
    if (asset.preview_url) setPreviewUrl(asset.preview_url);
  };

  const handleAssetSelectChange = (e) => {
    const assetId = e.target.value;
    setSelectedAssetId(assetId);
    setErrorMsg('');
    if (assetId === 'NEW') {
      setIsCreatingNew(true);
      setTitle('');
      setHumanPercent(90);
      setAiPercent(10);
    } else {
      setIsCreatingNew(false);
      const found = hubAssets.find(a => a.asset_id === assetId);
      if (found) populateAssetDetails(found);
    }
  };

  const handleHumanPercentChange = (val) => {
    const num = Math.min(100, Math.max(0, Number(val)));
    setHumanPercent(num);
    setAiPercent(100 - num);
    setErrorMsg('');
  };

  const handleAiPercentChange = (val) => {
    const num = Math.min(100, Math.max(0, Number(val)));
    setAiPercent(num);
    setHumanPercent(100 - num);
    setErrorMsg('');
  };

  // Determine Badge Tier
  let predictedBadge = 'Bronze';
  if (humanPercent >= 90) predictedBadge = 'Gold';
  else if (humanPercent >= 60) predictedBadge = 'Silver';
  else predictedBadge = 'Bronze';

  const isAiBlocked = aiPercent > 80;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isAiBlocked) {
      setErrorMsg('This asset exceeds the 80% AI-content limit and cannot be listed on PinIT Exchange.');
      return;
    }

    setLoading(true);

    try {
      let targetAssetId = selectedAssetId;

      // If creating new asset, protect in Hub Vault first
      if (isCreatingNew || !targetAssetId || targetAssetId === 'NEW') {
        const protectData = await apiProtectAsset({
          pinit_id: user?.pinit_id || 'PINIT-90481234',
          title: title || 'Untitled Provenance Asset',
          file_type: fileType,
          vertical: vertical,
          preview_url: previewUrl,
          human_percent: humanPercent,
          ai_percent: aiPercent
        });
        targetAssetId = protectData.asset.asset_id;
      }

      // Submit listing publish request to Exchange
      const listData = await apiPublishListing({
        asset_id: targetAssetId,
        pinit_id: user?.pinit_id || 'PINIT-90481234',
        title: title,
        description: description,
        vertical: vertical,
        tags: `${vertical},pinit,verified,provenance`,
        price_personal: pricePersonal,
        price_commercial: priceCommercial,
        price_exclusive: priceExclusive,
        price_enterprise: priceEnterprise,
        ai_training_opt_out: aiOptOut,
        human_percent: humanPercent,
        ai_percent: aiPercent,
        preview_url: previewUrl
      });

      setSuccessMsg(`🎉 Success! Listing published to PinIT Exchange with ${listData.listing?.badge_tier || predictedBadge} Badge.`);
      setLoading(false);
      setTimeout(() => {
        onListingCreated();
        onClose();
      }, 1200);

    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.15)',
              padding: '8px',
              borderRadius: '8px',
              color: 'var(--primary)'
            }}>
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>List Asset from PinIT Hub</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Publish vault-protected asset to public PinIT Exchange</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              color: '#f87171',
              fontSize: '0.88rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              color: '#34d399',
              fontSize: '0.88rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <div>{successMsg}</div>
            </div>
          )}

          {/* Select Hub Protected Asset */}
          <div className="form-group">
            <label className="form-label">Select Hub Protected Asset</label>
            <select 
              className="form-select"
              value={selectedAssetId}
              onChange={handleAssetSelectChange}
            >
              {hubAssets.map(a => (
                <option key={a.asset_id} value={a.asset_id}>
                  [{a.badge_tier} Badge] {a.title} ({a.human_percent}% Human) — ID: {a.asset_id}
                </option>
              ))}
              <option value="NEW">+ Protect New Asset in Hub Vault</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Listing Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Cybernetic Tokyo Night Architecture"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vertical / Category</label>
              <select className="form-select" value={vertical} onChange={e => setVertical(e.target.value)}>
                <option value="images">Photography &amp; Digital Art</option>
                <option value="video">Video / Film 8K</option>
                <option value="ui_ux">UI/UX Systems &amp; Kits</option>
                <option value="3d">3D Models &amp; PBR Textures</option>
                <option value="audio">Audio Stems &amp; Soundscapes</option>
                <option value="concepts">Concepts &amp; Creative Briefs</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description &amp; Provenance Notes</label>
            <textarea 
              className="form-textarea" 
              rows="3" 
              placeholder="Describe camera gear, creation workflow, location, and provenance authenticity notes..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* AI Content Policy & Authenticity Slider */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: isAiBlocked ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid var(--border-subtle)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>
                <Sparkles size={16} color="var(--primary)" />
                AI Content &amp; Authenticity Composition
              </div>

              <span className={`badge-${predictedBadge.toLowerCase()}`}>
                <Award size={14} /> {predictedBadge} Badge
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Manual / Human Originality: <strong style={{ color: 'var(--emerald)' }}>{humanPercent}%</strong></span>
              <span>AI-Generated Share: <strong style={{ color: isAiBlocked ? '#f87171' : 'var(--primary)' }}>{aiPercent}%</strong></span>
            </div>

            <input 
              type="range" 
              min="0" 
              max="100" 
              value={aiPercent}
              onChange={e => handleAiPercentChange(e.target.value)}
              style={{ width: '100%', marginBottom: '12px' }}
            />

            {isAiBlocked && (
              <div style={{ color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <ShieldAlert size={14} />
                <span><strong>Section 9 AI Policy Guard:</strong> Assets exceeding 80% AI-generated composition are prohibited from listing on PinIT Exchange.</span>
              </div>
            )}
          </div>

          {/* License Tier Pricing */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>Set License Tier Pricing (USD)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Personal License ($)</label>
                <input type="number" className="form-input" value={pricePersonal} onChange={e => setPricePersonal(Number(e.target.value))} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Commercial License ($)</label>
                <input type="number" className="form-input" value={priceCommercial} onChange={e => setPriceCommercial(Number(e.target.value))} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Exclusive Buyout ($)</label>
                <input type="number" className="form-input" value={priceExclusive} onChange={e => setPriceExclusive(Number(e.target.value))} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Enterprise Org Seat ($)</label>
                <input type="number" className="form-input" value={priceEnterprise} onChange={e => setPriceEnterprise(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || isAiBlocked}
            >
              {loading ? 'Publishing...' : 'Publish to Exchange'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
