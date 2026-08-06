import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Award, Lock, Sparkles, AlertCircle, CheckCircle, Info, DollarSign } from 'lucide-react';

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
      fetchHubAssets();
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const fetchHubAssets = async () => {
    try {
      const res = await fetch(`/api/hub/assets?pinit_id=${user?.pinit_id || 'PINIT-90481234'}`);
      if (res.ok) {
        const data = await res.json();
        setHubAssets(data);
        if (data.length > 0 && !selectedAssetId) {
          setSelectedAssetId(data[0].asset_id);
          populateAssetDetails(data[0]);
        }
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
        const protectRes = await fetch('/api/hub/protect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pinit_id: user?.pinit_id || 'PINIT-90481234',
            title: title || 'Untitled Provenance Asset',
            file_type: fileType,
            vertical: vertical,
            preview_url: previewUrl,
            human_percent: humanPercent,
            ai_percent: aiPercent
          })
        });

        const protectData = await protectRes.json();
        if (!protectRes.ok) {
          throw new Error(protectData.error || 'Failed to protect asset in PinIT Hub');
        }
        targetAssetId = protectData.asset.asset_id;
      }

      // Submit listing publish request to Exchange
      const listRes = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          ai_percent: aiPercent
        })
      });

      const listData = await listRes.json();

      if (!listRes.ok) {
        if (listData.error === 'AI_POLICY_VIOLATION') {
          setErrorMsg(`❌ ${listData.message}`);
        } else {
          setErrorMsg(listData.error || listData.message || 'Failed to publish listing to Exchange');
        }
        setLoading(false);
        return;
      }

      setSuccessMsg(`🎉 Success! Listing published to PinIT Exchange with ${listData.badge_assigned} Badge.`);
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
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '10px', borderRadius: '10px', display: 'flex' }}>
              <Lock size={20} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>List Asset from PinIT Hub</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Publish vault-protected asset to public PinIT Exchange</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertCircle size={20} shrink={0} />
                <div>{errorMsg}</div>
              </div>
            )}

            {successMsg && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <CheckCircle size={20} shrink={0} />
                <div>{successMsg}</div>
              </div>
            )}

            {/* Asset Selection */}
            <div className="form-group">
              <label className="form-label">Select Hub Protected Asset</label>
              <select 
                className="form-select"
                value={selectedAssetId}
                onChange={handleAssetSelectChange}
              >
                {hubAssets.map(asset => (
                  <option key={asset.asset_id} value={asset.asset_id}>
                    {asset.asset_id} — {asset.title} ({asset.badge_tier} Badge, {asset.human_percent}% Human, {asset.ai_percent}% AI)
                  </option>
                ))}
                <option value="NEW">+ Protect New Asset in Hub Vault</option>
              </select>
            </div>

            {/* Asset Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Listing Title</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Cybernetic Neo-Tokyo Architecture"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vertical / Category</label>
                <select className="form-select" value={vertical} onChange={e => setVertical(e.target.value)}>
                  <option value="images">Photography / Images</option>
                  <option value="video">Video / Film 8K</option>
                  <option value="ui_ux">UI/UX Components</option>
                  <option value="3d">3D Models & PBR</option>
                  <option value="audio">Audio / Soundscapes</option>
                  <option value="concepts">Concepts & Documents</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description & Provenance Notes</label>
              <textarea 
                className="form-textarea" 
                rows="2"
                placeholder="Describe technical capture details, camera gear, or artwork story..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Section 9: AI Content Policy Breakdown */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="var(--indigo)" />
                  AI Content & Authenticity Composition
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge-${predictedBadge.toLowerCase()}`}>
                    <Award size={12} /> {predictedBadge} Badge
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>Manual / Human Originality</span>
                    <strong style={{ color: 'var(--emerald)' }}>{humanPercent}%</strong>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={humanPercent} 
                    onChange={e => handleHumanPercentChange(e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--emerald)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>AI-Generated Share</span>
                    <strong style={{ color: isAiBlocked ? '#ef4444' : 'var(--primary)' }}>{aiPercent}%</strong>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={aiPercent} 
                    onChange={e => handleAiPercentChange(e.target.value)}
                    style={{ width: '100%', accentColor: isAiBlocked ? '#ef4444' : 'var(--primary)' }}
                  />
                </div>
              </div>

              {/* MANDATORY SECTION 9 AI BLOCK WARNING BANNER */}
              {isAiBlocked ? (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <ShieldAlert size={20} color="#ef4444" shrink={0} />
                  This asset exceeds the 80% AI-content limit and cannot be listed on PinIT Exchange.
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={14} color="var(--primary)" />
                  Authenticity level: <strong>{humanPercent}% Human</strong> feeds the Hub DNA provenance badge on listing cards & checkout.
                </div>
              )}
            </div>

            {/* Pricing Tiers & Net Fee Preview */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '10px' }}>Set License Tier Pricing ($ USD)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Personal</span>
                  <input 
                    type="number" 
                    className="form-input"
                    value={pricePersonal}
                    onChange={e => setPricePersonal(Number(e.target.value))}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Commercial</span>
                  <input 
                    type="number" 
                    className="form-input"
                    value={priceCommercial}
                    onChange={e => setPriceCommercial(Number(e.target.value))}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Exclusive</span>
                  <input 
                    type="number" 
                    className="form-input"
                    value={priceExclusive}
                    onChange={e => setPriceExclusive(Number(e.target.value))}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Enterprise</span>
                  <input 
                    type="number" 
                    className="form-input"
                    value={priceEnterprise}
                    onChange={e => setPriceEnterprise(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Platform Fee Breakdown */}
              <div style={{ 
                display: 'flex', 
                justify: 'space-between', 
                fontSize: '0.82rem', 
                color: 'var(--text-muted)', 
                marginTop: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-subtle)',
                padding: '10px 14px',
                borderRadius: '8px'
              }}>
                <span>Commercial Tier Breakdown:</span>
                <span>
                  Platform Fee (15%): <strong style={{ color: 'var(--text-main)' }}>${(priceCommercial * 0.15).toFixed(2)}</strong> | 
                  Creator Net (85%): <strong style={{ color: 'var(--emerald)' }}>${(priceCommercial * 0.85).toFixed(2)}</strong>
                </span>
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
              disabled={isAiBlocked || loading}
            >
              {loading ? 'Publishing...' : 'Publish to Exchange'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
